import { getDashboardStats, getHeatmapData } from '@/server/services/dashboard-service';
import { getTotalXP } from '@/server/services/xp-service';
import { calculateRank, getRankEmoji, RANK_THRESHOLDS } from '@/lib/utils/xp';
import { DisciplineHeatmap } from '@/components/ui/DisciplineHeatmap';
import { Zap, RotateCcw, CheckSquare, Flame, ArrowRight, Target, Compass, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { checkAndAwardMedals } from '@/server/services/medals-service';

/**
 * Hero Banner: TODAY'S MISSION
 * Command Center of the Day with Topographic SVG Contours & Saffron CTA
 */
export async function DashboardHeroMission({ userId }: { userId: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-[#20382B] text-[#F8F4EB] p-8 shadow-xl border border-white/10">
            {/* SVG Topographic Contour Lines Pattern Motif */}
            <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none opacity-15 stroke-[#D6A52C]"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M-50,80 Q100,20 250,90 T550,40 T850,110 T1150,50" fill="none" strokeWidth="1.5" />
                <path d="M-50,120 Q120,60 290,130 T600,80 T900,150 T1200,90" fill="none" strokeWidth="1.2" />
                <path d="M-50,160 Q150,100 330,170 T650,120 T950,190 T1250,130" fill="none" strokeWidth="1" />
                <circle cx="850" cy="110" r="4" fill="#D6A52C" />
                <circle cx="850" cy="110" r="12" fill="none" stroke="#D6A52C" strokeWidth="1" strokeDasharray="2 2" />
            </svg>

            <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                    <span className="h-2 w-2 rounded-full bg-[#D6A52C] animate-pulse" />
                    <span className="font-mono-tech text-xs font-bold text-[#D6A52C] uppercase tracking-widest">
                        PRIMARY MISSION
                    </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif-quote font-normal text-white leading-tight mb-2">
                    Complete your Morning Routine
                </h2>

                <p className="text-sm text-white/70 mb-6 font-medium leading-relaxed">
                    Build the foundation. Win the day. Start strong, maintain momentum, reach the summit.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                    <Link
                        href="/routine"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#D6A52C] px-6 py-3.5 text-sm font-bold text-[#20382B] shadow-md hover-lift hover:bg-[#c49526] transition-all"
                    >
                        Begin Mission <ArrowRight className="h-4 w-4" />
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-mono-tech text-white/60 bg-white/10 px-3 py-2 rounded-lg border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D6A52C]" />
                        Target Time: 08:00 AM
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Metric Performance System Row
 */
export async function DashboardMetricsRow({ userId, today }: { userId: string; today: string }) {
    const statsResult = await getDashboardStats(userId, today);
    const stats = statsResult?.success && statsResult.data ? statsResult.data : null;

    const totalXPResult = await getTotalXP(userId);
    const totalXP = totalXPResult?.success && totalXPResult.data !== undefined ? totalXPResult.data : 0;
    const rank = calculateRank(totalXP);

    const routinePct = Math.round(stats?.routine_completion_percentage || 0);
    const taskPct = Math.round(stats?.task_completion_percentage || 0);
    const streak = stats?.current_streak || 0;

    if (stats) {
        checkAndAwardMedals(userId, stats).catch(() => {});
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Routine */}
            <div className="card p-4 hover-lift flex flex-col justify-between">
                <span className="font-mono-tech text-[10px] text-textMuted uppercase tracking-widest">ROUTINE</span>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-black text-textMain tabular-nums">{routinePct}%</span>
                    <div className="h-8 w-8 rounded-lg bg-[#71866B]/15 text-[#71866B] flex items-center justify-center">
                        <RotateCcw className="h-4 w-4" />
                    </div>
                </div>
                <span className="text-[11px] text-textMuted mt-1">Completed today</span>
            </div>

            {/* Tasks */}
            <div className="card p-4 hover-lift flex flex-col justify-between">
                <span className="font-mono-tech text-[10px] text-textMuted uppercase tracking-widest">TASKS</span>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-black text-textMain tabular-nums">{taskPct}%</span>
                    <div className="h-8 w-8 rounded-lg bg-[#58718A]/15 text-[#58718A] flex items-center justify-center">
                        <CheckSquare className="h-4 w-4" />
                    </div>
                </div>
                <span className="text-[11px] text-textMuted mt-1">Objectives executed</span>
            </div>

            {/* Streak */}
            <div className="card p-4 hover-lift flex flex-col justify-between">
                <span className="font-mono-tech text-[10px] text-textMuted uppercase tracking-widest">STREAK</span>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-black text-[#B85C3D] tabular-nums">{streak} <span className="text-xs font-normal">Days</span></span>
                    <div className="h-8 w-8 rounded-lg bg-[#B85C3D]/15 text-[#B85C3D] flex items-center justify-center">
                        <Flame className="h-4 w-4 fill-[#B85C3D]" />
                    </div>
                </div>
                <span className="text-[11px] text-textMuted mt-1">Consecutive discipline</span>
            </div>

            {/* Daily XP */}
            <div className="card p-4 hover-lift flex flex-col justify-between border-l-2 border-l-[#D6A52C]">
                <span className="font-mono-tech text-[10px] text-[#D6A52C] uppercase tracking-widest font-bold">TOTAL XP</span>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-black text-[#D6A52C] tabular-nums">+{totalXP}</span>
                    <div className="h-8 w-8 rounded-lg bg-[#D6A52C]/20 text-[#D6A52C] flex items-center justify-center">
                        <Zap className="h-4 w-4 fill-[#D6A52C]" />
                    </div>
                </div>
                <span className="text-[11px] text-textMuted mt-1">Experience earned</span>
            </div>

            {/* Rank */}
            <div className="card p-4 hover-lift flex flex-col justify-between col-span-2 sm:col-span-1 border-l-2 border-l-[#20382B]">
                <span className="font-mono-tech text-[10px] text-textMuted uppercase tracking-widest font-bold">RANK</span>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-black text-[#20382B] truncate">{rank}</span>
                    <div className="text-2xl">{getRankEmoji(rank)}</div>
                </div>
                <span className="text-[11px] text-textMuted mt-1">Current clearance</span>
            </div>
        </div>
    );
}

/**
 * Focus Area Profile Component with Color Rhythm
 * Discipline -> Sage (#71866B)
 * Execution  -> Dusty Blue (#58718A)
 * Learning   -> Terracotta (#B85C3D)
 */
export function FocusAreaCard() {
    return (
        <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-xs font-bold text-textMuted uppercase tracking-widest">
                        OPERATIONAL PILLARS
                    </span>
                </div>
                <span className="text-[10px] font-mono-tech text-accent font-bold uppercase tracking-wider bg-accent-muted px-2 py-0.5 rounded">
                    ACTIVE TARGETS
                </span>
            </div>

            <div className="space-y-3.5">
                {/* Discipline - Sage */}
                <div className="p-3.5 rounded-xl bg-surface-muted/60 border border-border">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-[#71866B] text-white flex items-center justify-center shadow-sm">
                                <Target className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-textMain">Discipline Protocol</p>
                                <p className="text-[11px] text-textMuted">Keep promises to yourself without exception.</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold font-mono-tech text-[#71866B] block">TARGET 85%</span>
                            <span className="text-[10px] font-mono-tech text-textMuted uppercase">Daily Habit</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                        <div className="h-full bg-[#71866B] rounded-full w-[85%]" />
                    </div>
                </div>

                {/* Execution - Dusty Blue */}
                <div className="p-3.5 rounded-xl bg-surface-muted/60 border border-border">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-[#58718A] text-white flex items-center justify-center shadow-sm">
                                <Compass className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-textMain">Tactical Execution</p>
                                <p className="text-[11px] text-textMuted">Execute high-priority objectives first.</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold font-mono-tech text-[#58718A] block">TARGET 80%</span>
                            <span className="text-[10px] font-mono-tech text-textMuted uppercase">Focus Goal</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                        <div className="h-full bg-[#58718A] rounded-full w-[80%]" />
                    </div>
                </div>

                {/* Learning - Terracotta */}
                <div className="p-3.5 rounded-xl bg-surface-muted/60 border border-border">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-[#B85C3D] text-white flex items-center justify-center shadow-sm">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-textMain">Mental Mastery</p>
                                <p className="text-[11px] text-textMuted">Feed your intellect with daily study &amp; reflection.</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold font-mono-tech text-[#B85C3D] block">TARGET 75%</span>
                            <span className="text-[10px] font-mono-tech text-textMuted uppercase">Knowledge</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                        <div className="h-full bg-[#B85C3D] rounded-full w-[75%]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Discipline Heatmap Wrapper
 */
export async function DashboardHeatmapSection({ userId }: { userId: string }) {
    const heatmapResult = await getHeatmapData(userId, 30);
    const heatmapData = heatmapResult?.success && heatmapResult.data ? heatmapResult.data : [];

    return (
        <div className="card p-5">
            <DisciplineHeatmap data={heatmapData} />
        </div>
    );
}
