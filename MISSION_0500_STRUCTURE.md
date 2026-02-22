# MISSION 0500 - Project Structure

```
mission-0500/
├── public/
│   └── favicons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (redirect to /dashboard)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── routine/
│   │   │   └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   ├── goals/
│   │   │   └── page.tsx
│   │   ├── report/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── auth/
│   │           └── callback/
│   │               └── route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── DesktopNav.tsx
│   │   │   └── Header.tsx
│   │   ├── cards/
│   │   │   ├── RoutineCard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   └── StatCard.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Dialog.tsx
│   │   └── modules/
│   │       ├── RoutineModule.tsx
│   │       ├── TasksModule.tsx
│   │       ├── GoalsModule.tsx
│   │       └── ReportModule.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── utils/
│   │   │   ├── xp.ts
│   │   │   ├── streak.ts
│   │   │   ├── rank.ts
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   └── constants/
│   │       ├── colors.ts
│   │       ├── ranks.ts
│   │       └── xp-config.ts
│   ├── server/
│   │   ├── actions/
│   │   │   ├── auth.ts
│   │   │   ├── routine.ts
│   │   │   ├── tasks.ts
│   │   │   ├── goals.ts
│   │   │   └── reports.ts
│   │   └── services/
│   │       ├── routine-service.ts
│   │       ├── task-service.ts
│   │       ├── goal-service.ts
│   │       └── xp-service.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── .env.local (local dev)
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
