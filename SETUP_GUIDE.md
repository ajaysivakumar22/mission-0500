// src/app/page.tsx

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/dashboard');
}

---

# MISSION 0500 - SETUP & DEPLOYMENT GUIDE

## Prerequisites
- Node.js 18+
- PostgreSQL database (via Supabase)
- Supabase account

## 1. Local Development Setup

### Step 1: Clone & Install Dependencies
```bash
git clone <your-repo>
cd mission-0500
npm install
```

### Step 2: Setup Supabase
1. Create a new Supabase project at https://supabase.com
2. Go to Settings → API Keys and copy:
   - Project URL
   - Anon Key
   - Service Role Key

### Step 3: Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 4: Setup Database
1. In Supabase dashboard, go to SQL Editor
2. Create a new query
3. Copy-paste the entire contents of `schema.sql`
4. Click "Run"

This will:
- Create all tables
- Setup Row Level Security (RLS) policies
- Create helper functions
- Setup triggers

### Step 5: Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 2. Database Schema

The schema includes:
- `users` - User profiles
- `daily_routines` - Daily routine items
- `daily_tasks` - Task tracking
- `goals` - Goal management
- `goal_logs` - Goal progress tracking
- `daily_reports` - End-of-day reflections
- `xp_records` - XP points tracking
- `streaks` - Streak tracking
- `user_settings` - User preferences

All tables have RLS enabled for security.

## 3. Features Implemented

### Auth Module
- Email/password signup
- Email/password login
- Secure session management
- Profile management

### Daily Routine
- Preloaded default routine template
- Add/edit/delete routine items
- Mark routine items as complete
- Automatic XP award on completion
- Full-day completion bonus
- Completion percentage tracking

### Daily Tasks
- Create/edit/delete tasks
- Priority levels (Low/Medium/High)
- Link tasks to goals
- Mark as complete
- Completion tracking

### Goals System
- Short/Mid/Long-term goals
- Progress tracking with percentage
- Goal logs for detailed entries
- Archive goals
- Visual progress bars

### Daily Report
- End-of-day journaling
- Track accomplishments and failures
- Record lessons learned
- Discipline score (1-10)
- Energy score (1-10)
- Historical report storage

### XP & Rank System
- Routine completion: +5 XP
- Task completion: +10 XP
- Full day completion: +25 XP bonus
- Automatic rank calculation
- Four ranks: Cadet → Senior Cadet → Officer → Commander

### Dashboard
- Real-time stats
- XP progress
- Current rank
- Streak tracking
- Daily completion percentage
- Quick access to all modules

## 4. Deployment (Vercel)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial MISSION 0500 commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### Step 2: Deploy Frontend
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click "Deploy"

### Step 3: Configure Production Supabase
1. In Supabase dashboard, go to Settings → Auth
2. Add your Vercel domain to "Allowed Redirect URLs"
3. Format: `https://yourdomain.vercel.app/auth/callback`

## 5. Security Checklist

✅ All database tables use RLS
✅ Every query filters by user_id
✅ No client-side database bypasses
✅ Protected routes via middleware
✅ Secure session management
✅ Environment variables for secrets
✅ HTTPS enforced in production

## 6. Customization

### Change Color Scheme
Edit `src/lib/constants/colors.ts`:
```typescript
export const COLORS = {
  primary: '#1B4332',    // Change these
  accent: '#FFD60A',
  // ... etc
};
```

### Modify Default Routine
Edit `src/lib/constants/xp-config.ts`:
```typescript
export const DEFAULT_ROUTINE_ITEMS = [
  { name: 'Your custom item', order: 1 },
  // ... add more items
];
```

### Change XP Rules
Edit `src/lib/utils/xp.ts`:
```typescript
export const XP_CONFIG = {
  ROUTINE_COMPLETION: 5,  // Change values
  TASK_COMPLETION: 10,
  FULL_DAY_BONUS: 25,
};
```

## 7. Troubleshooting

### "Authentication required" on all pages
- Check if Supabase credentials are correct in `.env.local`
- Verify database tables exist
- Check RLS policies are enabled

### XP not being awarded
- Verify `xp_records` table exists
- Check server actions are executing
- Review browser console for errors

### Slow performance
- Check Supabase query count
- Verify database indexes
- Review network tab in DevTools

## 8. Performance Optimization

- Server Components used by default
- Server Actions for mutations
- Revalidation on data changes
- Proper indexing on user_id and dates

## 9. Database Backups

Supabase automatically backs up your database daily.
To export manually:
1. Go to Supabase dashboard
2. Settings → Database
3. Click "Export"

## 10. Monitoring & Analytics

Track in your Vercel dashboard:
- Deployment frequency
- Build times
- Runtime errors
- Page performance

Monitor Supabase:
- Query count
- Database size
- Real-time connections
- Auth events

## 11. Next Steps After Deployment

1. **Email Verification** - Enable email verification in Supabase Auth settings
2. **Custom Domain** - Setup custom domain in Vercel
3. **Analytics** - Integrate analytics (Vercel Web Analytics)
4. **Monitoring** - Setup error tracking (Sentry)
5. **Backup Schedule** - Configure automated backups

## 12. Support & Resources

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

**MISSION 0500 is now ready for production deployment!**
