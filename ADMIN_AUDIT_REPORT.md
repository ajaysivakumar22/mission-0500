# ADMIN SYSTEM AUDIT REPORT

**Date:** March 6, 2026  
**Scope:** Admin introduction, login logic, admin dashboard, routing, database schema  
**Verdict:** CRITICAL — 7 issues found, 4 are system-breaking

---

## ISSUE #1: `role` column DOES NOT EXIST in `users` table [CRITICAL - ROOT CAUSE]

**Location:** `schema.sql`, `supabase/migrations/`  
**Impact:** ALL admin routing is broken — every role check returns `null`

The `users` table in `schema.sql` has NO `role` column:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
No migration adds it either. Every file that does `.select('role')` gets nothing back.

**Files affected:**
- `src/app/admin/layout.tsx` — `profile.role !== 'admin'` is ALWAYS true → always redirects to `/dashboard` → admin can never enter
- `src/app/login/page.tsx` — `profile?.role === 'admin'` is ALWAYS false → admin always sent to `/dashboard`
- `src/app/page.tsx` — same issue
- `src/app/dashboard/page.tsx` — same issue

**Fix:** Create migration adding `role TEXT DEFAULT 'user'` to users table.

---

## ISSUE #2: `user_feedbacks` table DOES NOT EXIST in migrations [CRITICAL]

**Location:** `supabase/migrations/`  
**Impact:** Admin page crashes on load. Feedback submission crashes.

`src/app/admin/page.tsx` does:
```ts
const { data: feedbacks } = await supabase.from('user_feedbacks').select(...)
```
`src/server/actions/feedback.ts` does:
```ts
await supabase.from('user_feedbacks').insert(...)
```

But there is NO migration creating this table. If it wasn't manually created in Supabase, the admin server component throws an unhandled error → Next.js returns a 500/blank page.

**Fix:** Create migration for `user_feedbacks` table.

---

## ISSUE #3: RLS blocks admin from reading other users [CRITICAL]

**Location:** `schema.sql` — RLS policies on `users` table  
**Impact:** Admin dashboard only shows the admin's own row, not all users

```sql
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);
```

When the admin page runs `supabase.from('users').select(...)`, RLS restricts results to only the admin's own row. `usersCount` returns 1. The Personnel Roster shows only 1 record.

**Fix:** Add admin-bypass RLS policy OR use `supabaseAdmin` (service role) in admin page.

---

## ISSUE #4: Admin layout uses network-dependent `auth.getUser()` [MEDIUM]

**Location:** `src/app/admin/layout.tsx`  
**Impact:** Admin page hangs/fails if Supabase API is slow or unreachable

```ts
const { data: { user } } = await supabase.auth.getUser();
```

The rest of the app uses `getServerSession()` which reads the JWT cookie locally (zero network calls). The admin layout makes a live API call to Supabase, which can hang.

**Fix:** Use `getServerSession()` consistently.

---

## ISSUE #5: Middleware does NOT protect `/admin` route [MEDIUM]

**Location:** `src/lib/supabase/middleware.ts`  
**Impact:** Unauthenticated user reaching `/admin` causes server-side crash

```ts
const protectedRoutes = ['/dashboard', '/routine', '/tasks', '/goals', '/report', '/settings'];
// /admin is NOT listed
```

Without middleware protection, an unauthenticated request to `/admin` bypasses the cookie check and hits the server component which then tries `supabase.auth.getUser()` with no cookie → returns null → redirect to login. This works but is fragile and inconsistent with the rest of the app.

**Fix:** Add `/admin` to `protectedRoutes`.

---

## ISSUE #6: Auth callback ignores admin role [MINOR]

**Location:** `src/app/api/auth/callback/route.ts`  
**Impact:** Admin using OAuth (Google/GitHub) always lands on `/dashboard` first

```ts
const next = searchParams.get('next') ?? '/dashboard';
```

This always defaults to `/dashboard`. The dashboard server component will eventually redirect to `/admin`, but it causes a double-redirect flash.

**Fix:** Root page (`/`) already handles role-based routing. Change default to `/` instead of `/dashboard`.

---

## ISSUE #7: Admin page uses anon client for cross-user data [MEDIUM]

**Location:** `src/app/admin/page.tsx`  
**Impact:** Even with RLS fixes, using anon client is architecturally wrong for admin operations

The admin page uses `createClient()` (anon key, respects RLS) to fetch all users. Admin operations should use `supabaseAdmin` (service role key, bypasses RLS) to ensure the admin can read all data regardless of RLS policies.

**Fix:** Use `supabaseAdmin` in admin page for data fetching.

---

## SUMMARY

| # | Issue | Severity | Type |
|---|-------|----------|------|
| 1 | No `role` column in DB | CRITICAL | Schema |
| 2 | No `user_feedbacks` table | CRITICAL | Schema |
| 3 | RLS blocks admin reads | CRITICAL | Security/Logic |
| 4 | Network-dependent auth | MEDIUM | Performance |
| 5 | Unprotected `/admin` route | MEDIUM | Security |
| 6 | Callback ignores role | MINOR | UX |
| 7 | Anon client for admin ops | MEDIUM | Architecture |

**Root cause of black screen:** Issues #1 + #2 + #3 combined. The admin page server component crashes because the `user_feedbacks` table doesn't exist, the `role` column doesn't exist (so layout auth fails unpredictably), and even if it worked, RLS would block data access.
