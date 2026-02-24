'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { VisionBoardGrid } from '@/components/ui/VisionBoardGrid';
import { StatCard } from '@/components/cards/StatCard';
import { getRankEmoji, RANK_THRESHOLDS, getXPForNextRank } from '@/lib/utils/xp';
import { Zap, Target, Award, RotateCcw, CheckSquare, Flame, Shield, ArrowUpRight } from 'lucide-react';
import type { DashboardStats } from '@/types';
import type { Rank } from '@/lib/utils/xp';

interface DashboardClientProps {
    stats: DashboardStats | null;
    totalXP: number;
    rank: Rank;
}

export default function DashboardClient({ stats, totalXP, rank }: DashboardClientProps) {
    const nextRankXP = getXPForNextRank(rank);
    const currentRankXP = RANK_THRESHOLDS[rank];
    const progressXP = totalXP - currentRankXP;
    const requiredXP = nextRankXP - currentRankXP;
    const progressPercentage = Math.min(100, Math.max(0, (progressXP / requiredXP) * 100));

    const ranks = Object.keys(RANK_THRESHOLDS) as Rank[];
    const currentRankIndex = ranks.indexOf(rank);
    const nextRankName = currentRankIndex === ranks.length - 1 ? 'Max Rank' : ranks[currentRankIndex + 1];

    const hasActiveStreak = (stats?.current_streak || 0) >= 3;
    const isBurning = (stats?.current_streak || 0) >= 7;

    return (
        <MainLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    title="Command Headquarters"
                    subtitle="Welcome back, future Officer. Review your stats and prepare for the day's mission."
                />

                <div className="mb-8">
                    <VisionBoardGrid />
                </div>

                {/* Rank Section */}
                <div className="relative overflow-hidden rounded-2xl border border-[#FFD60A]/30 bg-gradient-to-br from-[#162B20] to-[#0B1D13] p-8 text-center shadow-[0_0_30px_rgba(255,214,10,0.05)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD60A] to-transparent opacity-50"></div>

                    <div className="text-6xl mb-6 drop-shadow-2xl animate-bounce-slow flex justify-center">{getRankEmoji(rank)}</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-[#FFD60A]" />
                        <p className="text-sm font-bold tracking-widest text-[#9CA3AF] uppercase">Current Rank</p>
                        <Shield className="h-5 w-5 text-[#FFD60A]" />
                    </div>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD60A] to-[#FFF3B0] drop-shadow-lg uppercase tracking-wider mb-8">{rank}</div>

                    {/* Progress to Next Rank */}
                    <div className="max-w-md mx-auto relative group">
                        <div className="flex justify-between items-end mb-2">
                            <div className="text-left">
                                <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-bold mb-1">Total Experience</p>
                                <p className="text-2xl font-black text-white flex items-center gap-1">
                                    <Zap className="h-5 w-5 text-[#FFD60A]" /> {totalXP}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-bold mb-1">Next: {nextRankName}</p>
                                <p className="text-sm font-bold text-[#FFD60A]">
                                    {progressXP} / {requiredXP} XP
                                </p>
                            </div>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-4 rounded-full bg-black/60 border border-white/10 overflow-hidden relative">
                            {/* Inner Bar */}
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFD60A]/80 to-[#FFD60A] shadow-[0_0_15px_rgba(255,214,10,0.5)] transition-all duration-1000 ease-out relative"
                                style={{ width: `${progressPercentage}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px] animate-pulse"></div>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-center text-[#9CA3AF] font-medium tracking-wide">
                            {progressPercentage === 100 ? 'Promotion available!' : `${100 - Math.round(progressPercentage)}% remaining until promotion to ${nextRankName}`}
                        </p>
                    </div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        label="Routine Completion"
                        value={stats?.routine_completion_percentage?.toFixed(0) || '0'}
                        unit="%"
                        icon={<RotateCcw className="h-8 w-8" />}
                    />
                    <StatCard
                        label="Tasks Completed"
                        value={stats?.task_completion_percentage?.toFixed(0) || '0'}
                        unit="%"
                        icon={<CheckSquare className="h-8 w-8" />}
                    />
                    <StatCard
                        label="Active Goals"
                        value={stats?.active_goals_count || 0}
                        icon={<Target className="h-8 w-8" />}
                    />
                    <div className={`relative ${isBurning ? 'animate-pulse' : ''}`}>
                        {isBurning && <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-xl"></div>}
                        <StatCard
                            label="Current Streak"
                            value={stats?.current_streak || 0}
                            unit=" days"
                            icon={<Flame className={`h-8 w-8 ${hasActiveStreak ? (isBurning ? 'text-orange-500 animate-bounce' : 'text-[#FFD60A]') : 'text-gray-500'}`} />}
                        />
                    </div>
                    <StatCard
                        label="Daily XP"
                        value={totalXP}
                        icon={<Zap className="h-8 w-8" />}
                    />
                    <StatCard
                        label="Rank Progress"
                        value={rank}
                        icon={<Award className="h-8 w-8" />}
                    />
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6">
                    <h3 className="mb-4 text-lg font-bold text-[#E8E8E8]">Quick Actions</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Link
                            href="/routine"
                            className="rounded-lg border border-[#1E3A2A] bg-[#0B1D13] px-6 py-3 text-center font-medium text-[#FFD60A] hover:bg-[#162B20] transition-colors"
                        >
                            📋 View Routine
                        </Link>
                        <Link
                            href="/tasks"
                            className="rounded-lg border border-[#1E3A2A] bg-[#0B1D13] px-6 py-3 text-center font-medium text-[#FFD60A] hover:bg-[#162B20] transition-colors"
                        >
                            ✓ View Tasks
                        </Link>
                        <Link
                            href="/goals"
                            className="rounded-lg border border-[#1E3A2A] bg-[#0B1D13] px-6 py-3 text-center font-medium text-[#FFD60A] hover:bg-[#162B20] transition-colors"
                        >
                            🎯 View Goals
                        </Link>
                        <Link
                            href="/report"
                            className="rounded-lg border border-[#1E3A2A] bg-[#0B1D13] px-6 py-3 text-center font-medium text-[#FFD60A] hover:bg-[#162B20] transition-colors"
                        >
                            📝 Daily Report
                        </Link>
                        <Link
                            href="/settings"
                            className="rounded-lg border border-[#1E3A2A] bg-[#0B1D13] px-6 py-3 text-center font-medium text-[#FFD60A] hover:bg-[#162B20] transition-colors"
                        >
                            ⚙️ Settings
                        </Link>
                    </div>
                </div>

                {/* Today's Performance */}
                {stats && (
                    <div className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6">
                        <h3 className="mb-4 text-lg font-bold text-[#E8E8E8]">Today&apos;s Performance</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[#9CA3AF]">Routine Tasks</span>
                                    <span className="font-bold text-[#FFD60A]">{stats.routine_completion_percentage.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-[#0B1D13] overflow-hidden">
                                    <div
                                        className="h-full bg-[#FFD60A] transition-all duration-300"
                                        style={{ width: `${Math.min(stats.routine_completion_percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[#9CA3AF]">Daily Tasks</span>
                                    <span className="font-bold text-[#FFD60A]">{stats.task_completion_percentage.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-[#0B1D13] overflow-hidden">
                                    <div
                                        className="h-full bg-[#FFD60A] transition-all duration-300"
                                        style={{ width: `${Math.min(stats.task_completion_percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
