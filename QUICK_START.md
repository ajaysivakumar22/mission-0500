# MISSION 0500 - QUICK START CHECKLIST

## ✅ PRE-DEPLOYMENT CHECKLIST

### Local Development (15 minutes)
- [ ] Node.js 18+ installed
- [ ] Create Supabase project
- [ ] Copy .env.example → .env.local
- [ ] Add Supabase credentials to .env.local
- [ ] `npm install`
- [ ] Execute schema.sql in Supabase
- [ ] `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Create test account
- [ ] Test all pages

### Before Deployment
- [ ] Verify all environment variables
- [ ] Test authentication flow
- [ ] Check responsive design (mobile/desktop)
- [ ] Verify XP system is awarding points
- [ ] Test daily routine completion
- [ ] Confirm rank calculation works
- [ ] Test task and goal creation
- [ ] Verify report saving

## 🚀 DEPLOYMENT STEPS

### Step 1: Prepare Repository
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "MISSION 0500 - Initial deployment"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/mission-0500.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy Frontend (Vercel)
1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repository
4. Project name: `mission-0500`
5. Framework: Next.js
6. Root directory: ./
7. Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your_supabase_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_anon_key
   - `SUPABASE_SERVICE_ROLE_KEY` = your_service_role_key
8. Click "Deploy"

### Step 3: Configure Supabase Auth
1. In Supabase dashboard
2. Authentication → Providers → Email
3. Settings → Auth
4. Allowed Redirect URLs:
   - http://localhost:3000/auth/callback (local)
   - https://YOUR_DOMAIN.vercel.app/auth/callback (production)
5. Save

### Step 4: Verify Deployment
- [ ] Domain accessible
- [ ] Login page loads
- [ ] Can create account
- [ ] Can login
- [ ] Dashboard shows stats
- [ ] Can add routine items
- [ ] Can create tasks
- [ ] XP is being awarded

## 📝 FILE ORGANIZATION GUIDE

### Copy to your project:

```
mission-0500/
├── src/
│   ├── app/
│   │   ├── login/page.tsx (from src_app_login.ts)
│   │   ├── dashboard/page.tsx (from src_app_dashboard.ts)
│   │   ├── routine/page.tsx (from src_app_routine.ts)
│   │   ├── tasks/page.tsx (from src_app_tasks_settings.ts)
│   │   ├── goals/page.tsx (from src_app_goals_report.ts)
│   │   ├── report/page.tsx (from src_app_goals_report.ts)
│   │   ├── settings/page.tsx (from src_app_tasks_settings.ts)
│   │   ├── page.tsx (create: redirect to /dashboard)
│   │   ├── layout.tsx (from src_app_login.ts)
│   │   └── globals.css (from src_app_login.ts)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── DesktopNav.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Header.tsx
│   │   │   (all from src_components_layout.ts)
│   │   ├── cards/
│   │   │   ├── StatCard.tsx
│   │   │   ├── RoutineCard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── GoalCard.tsx
│   │   │   (all from src_components_cards.ts)
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Textarea.tsx
│   │       ├── Checkbox.tsx
│   │       ├── Select.tsx
│   │       └── Dialog.tsx
│   │       (all from src_components_ui.ts)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   │   (from supabase_clients.ts)
│   │   ├── constants/
│   │   │   ├── colors.ts
│   │   │   ├── ranks.ts
│   │   │   ├── xp-config.ts
│   │   │   └── motivational-quotes.ts
│   │   │   (from src_lib_constants.ts)
│   │   ├── utils/
│   │   │   ├── xp.ts
│   │   │   ├── streak.ts
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   │   (from src_lib_utils.ts)
│   │   └── hooks/
│   │       └── useMediaQuery.ts
│   │       (from src_components_layout.ts)
│   ├── server/
│   │   ├── actions/
│   │   │   ├── auth.ts (from src_server_actions_auth.ts)
│   │   │   ├── routine.ts (from src_server_actions_routine.ts)
│   │   │   ├── tasks.ts (from src_server_actions_tasks.ts)
│   │   │   ├── goals.ts (from src_server_actions_goals.ts)
│   │   │   └── reports.ts (from src_server_actions_reports.ts)
│   │   └── services/
│   │       ├── xp-service.ts
│   │       └── dashboard-service.ts
│   │       (from src_server_services.ts)
│   ├── types/
│   │   └── index.ts (from src_types_index.ts)
│   └── middleware.ts (from src_middleware.ts)
├── schema.sql (database setup)
├── package.json (from package.json)
├── tsconfig.json (from configs.ts)
├── next.config.js (from configs.ts)
├── tailwind.config.js (from configs.ts)
├── postcss.config.js (from configs.ts)
├── .env.example (from configs.ts)
├── .eslintrc.json (from configs.ts)
├── SETUP_GUIDE.md (full setup instructions)
└── README.md (project overview)
```

## 🔧 CONFIGURATION CHECKLIST

- [ ] Rename .env.example to .env.local
- [ ] Update Supabase URL
- [ ] Update Supabase Anon Key
- [ ] Update Service Role Key
- [ ] Run `npm install`
- [ ] Execute schema.sql
- [ ] Update Supabase Auth redirect URLs
- [ ] Test locally: `npm run dev`

## 🧪 TESTING CHECKLIST

### Authentication
- [ ] Sign up new account
- [ ] Receive confirmation email (if enabled)
- [ ] Sign in with credentials
- [ ] Session persists on page reload
- [ ] Logout works
- [ ] Redirect to login when not authenticated

### Daily Routine
- [ ] Default routine items load
- [ ] Can toggle completion
- [ ] Completion percentage updates
- [ ] Can add custom routine items
- [ ] Can delete routine items
- [ ] XP awarded on completion (+5 XP)
- [ ] Full day bonus awarded (+25 XP if all complete)

### Tasks
- [ ] Can create task
- [ ] Can set priority
- [ ] Can toggle completion
- [ ] Can delete task
- [ ] XP awarded on completion (+10 XP)
- [ ] Completion percentage updates

### Goals
- [ ] Can create goal in each category
- [ ] Progress bar updates
- [ ] Can archive goal
- [ ] Can add goal logs
- [ ] Goal logs display with timestamps

### Reports
- [ ] Can save daily report
- [ ] Can edit report
- [ ] Scores persist
- [ ] Multiple days can have reports

### XP & Ranks
- [ ] XP total increases correctly
- [ ] Rank updates at thresholds
- [ ] Rank emoji displays correctly
- [ ] XP history visible

### Dashboard
- [ ] All stats display
- [ ] Completion percentages correct
- [ ] Rank displays
- [ ] Streak counts correctly
- [ ] Quick action buttons work

### Mobile
- [ ] Bottom navigation displays (mobile view)
- [ ] Sidebar hidden on mobile
- [ ] All cards responsive
- [ ] Touch targets large enough
- [ ] Forms work on mobile

### Desktop
- [ ] Sidebar displays
- [ ] Bottom nav hidden
- [ ] Layout uses full width
- [ ] Navigation works

## 🐛 TROUBLESHOOTING

### "Cannot read property 'user' of null"
- Check Supabase credentials
- Verify NEXT_PUBLIC_SUPABASE_URL is correct
- Check RLS policies

### XP not being awarded
- Verify xp_records table exists
- Check database schema ran completely
- Review browser console for errors
- Check server action logs

### Authentication fails
- Verify email/password in .env
- Check Supabase email provider is enabled
- Confirm auth redirects configured

### Database connection error
- Verify NEXT_PUBLIC_SUPABASE_URL
- Check service role key
- Verify schema.sql executed successfully

### Middleware errors
- Check middleware.ts exists
- Verify routes in middleware match actual routes
- Clear .next folder: `rm -rf .next`
- Rebuild: `npm run build`

## 📞 SUPPORT RESOURCES

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

## 🎯 SUCCESS CRITERIA

✅ Project is production-ready when:
- [ ] All pages load without errors
- [ ] Authentication works (signup/login/logout)
- [ ] XP system awards points correctly
- [ ] Ranks calculate automatically
- [ ] All CRUD operations work
- [ ] Responsive on mobile and desktop
- [ ] Database has proper RLS
- [ ] Deployed to Vercel successfully
- [ ] Custom domain configured
- [ ] HTTPS enabled

---

**MISSION 0500 is ready for launch! 🚀**
