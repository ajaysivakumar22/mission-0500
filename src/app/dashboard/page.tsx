import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getServerSession } from '@/lib/supabase/server';
import { getUserSettings } from '@/server/actions/settings';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getServerDate } from '@/server/utils/timezone';
import { MainLayout } from '@/components/layout/MainLayout';
import { MorningBriefingModal } from '@/components/ui/MorningBriefingModal';
import {
    DashboardHeroMission,
    DashboardMetricsRow,
    FocusAreaCard,
    DashboardHeatmapSection
} from './DashboardSections';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { Skeleton } from '@/components/ui/Skeletons';
import Link from 'next/link';
import { RotateCcw, CheckSquare2, Target, FileText, Award, Star } from 'lucide-react';

import { getFormattedDate, getWeekdayUpper, getDayOfYear } from '@/lib/utils/date';

import { FutureOperationsCard } from '@/components/cards/FutureOperationsCard';

export default async function DashboardPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }
    const userId = session.user.id;

    const [profileRes, settingsRes] = await Promise.allSettled([
        supabaseAdmin.from('users').select('role').eq('id', userId).single(),
        getUserSettings(userId)
    ]);
    const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null;
    const userSettings = settingsRes.status === 'fulfilled' ? settingsRes.value.data : null;

    if (profile?.role === 'admin') redirect('/admin');

    if (userSettings && userSettings.onboarding_completed === false) {
        const { count } = await supabaseAdmin.from('daily_routines').select('id', { count: 'exact', head: true }).eq('user_id', userId).limit(1);
        if (!count || count === 0) redirect('/onboarding');
    }

    const userFullName = (session.user.user_metadata?.full_name as string) || (session.user.user_metadata?.name as string) || '';
    const userFirstName = userFullName ? userFullName.split(' ')[0] : (session.user.email?.split('@')[0] || 'there');

    const formattedDate = getFormattedDate();
    const weekday = getWeekdayUpper();
    const dayOfYear = getDayOfYear();

    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Top Header Greeting & Operational Hero Date Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1 pb-2 border-b border-border/40">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                            <span className="font-mono-tech text-xs text-textMuted uppercase tracking-widest font-bold">TACTICAL COMMAND</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-serif-quote font-bold text-textMain tracking-tight">
                            Good morning, {userFirstName}.
                        </h1>
                        <p className="text-sm text-textSecondary mt-0.5 font-medium">
                            Discipline today, freedom tomorrow.
                        </p>
                    </div>

                    <div className="text-left sm:text-right font-mono-tech">
                        <span className="text-xs text-textMuted uppercase block tracking-wider font-bold">
                            {weekday}
                        </span>
                        <span className="text-lg font-black text-textMain tracking-wide">{formattedDate}</span>
                        <div className="flex items-center sm:justify-end gap-2 mt-0.5">
                            <span className="inline-block bg-accent-muted text-accent border border-accent/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest">
                                DAY {dayOfYear}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Morning Briefing modal check */}
                <Suspense fallback={null}>
                    <ObjectivesCheckWrapper userId={userId} />
                </Suspense>

                {/* Hero Mission Banner */}
                <Suspense fallback={<Skeleton className="h-44 w-full rounded-2xl" />}>
                    <DashboardHeroMission userId={userId} />
                </Suspense>

                {/* Key Metrics Row */}
                <Suspense fallback={<Skeleton className="h-24 w-full card" />}>
                    <MetricsRowWrapper userId={userId} />
                </Suspense>

                {/* Main Content Asymmetric 3-Column Layout */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Left Column (2 Cols wide) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Focus Area Card */}
                        <FocusAreaCard />

                        {/* Command Access Operational Action Dispatch */}
                        <div className="card p-5 space-y-3">
                            <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                <span className="font-mono-tech text-xs font-bold text-textMuted uppercase tracking-widest">
                                    COMMAND ACCESS
                                </span>
                                <span className="text-[10px] font-mono-tech text-accent font-bold uppercase tracking-wider">
                                    RAPID NAVIGATION
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {[
                                    { href: '/routine', label: 'Routine', sub: 'Daily Protocol', icon: RotateCcw },
                                    { href: '/tasks', label: 'Tasks', sub: 'Objectives', icon: CheckSquare2 },
                                    { href: '/goals', label: 'Goals', sub: 'Milestones', icon: Target },
                                    { href: '/report', label: 'Report', sub: 'AAR Log', icon: FileText },
                                    { href: '/medals', label: 'Medals', sub: 'Honors', icon: Award },
                                ].map(({ href, label, sub, icon: Icon }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="card-muted p-3.5 flex flex-col items-start gap-1.5 hover:bg-surface hover:border-accent hover-lift transition-all duration-200 group"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-[#20382B] transition-colors">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-bold text-textMain mt-1">{label}</span>
                                        <span className="text-[10px] font-mono-tech text-textMuted">{sub}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Daily Reminder Banner */}
                        <div className="card p-5 bg-gradient-to-r from-surface to-surface-muted border-l-4 border-l-accent flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center flex-shrink-0">
                                <Star className="h-5 w-5 fill-accent" />
                            </div>
                            <div>
                                <span className="font-mono-tech text-[10px] text-textMuted uppercase tracking-widest block mb-0.5">DIRECTIVE</span>
                                <p className="text-sm font-serif-quote font-bold text-textMain leading-snug">
                                    Small disciplines repeated daily create massive long-term results.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1 Col wide) */}
                    <div className="space-y-6">

                        {/* Today's Quote Editorial Block */}
                        <div className="space-y-2">
                            <span className="font-mono-tech text-xs font-bold text-textMuted uppercase tracking-widest block">
                                TODAY&apos;S QUOTE
                            </span>
                            <InspirationalQuote compact pageKey="dashboard" />
                        </div>

                        {/* Discipline Heatmap (30 Days) */}
                        <Suspense fallback={<Skeleton className="h-36 w-full card" />}>
                            <DashboardHeatmapSection userId={userId} />
                        </Suspense>

                        {/* Future Operations Module Preview */}
                        <FutureOperationsCard />

                    </div>

                </div>

            </div>
        </MainLayout>
    );
}

async function ObjectivesCheckWrapper({ userId }: { userId: string }) {
    const today = await getServerDate(userId);
    const { data: objectives } = await supabaseAdmin
        .from('daily_tasks')
        .select('id')
        .eq('user_id', userId)
        .eq('task_date', today)
        .like('title', 'MAIN OBJECTIVE:%')
        .limit(1);

    const hasTodayObjective = !!(objectives && objectives.length > 0);
    return <MorningBriefingModal userId={userId} hasTodayObjective={hasTodayObjective} />;
}

async function MetricsRowWrapper({ userId }: { userId: string }) {
    const today = await getServerDate(userId);
    return <DashboardMetricsRow userId={userId} today={today} />;
}
