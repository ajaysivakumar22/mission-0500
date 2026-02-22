'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/cards/StatCard';
import { getRankEmoji } from '@/lib/utils/xp';
import { Zap, Target, Award, RotateCcw, CheckSquare, Flame } from 'lucide-react';
import type { DashboardStats } from '@/types';
import type { Rank } from '@/lib/utils/xp';

interface DashboardClientProps {
    stats: DashboardStats | null;
    totalXP: number;
    rank: Rank;
}

export default function DashboardClient({ stats, totalXP, rank }: DashboardClientProps) {
    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Rank Section */}
                <div className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-8 text-center">
                    <div className="text-5xl mb-4">{getRankEmoji(rank)}</div>
                    <p className="text-sm text-[#9CA3AF]">Current Rank</p>
                    <h2 className="text-4xl font-bold text-[#FFD60A]">{rank}</h2>
                    <p className="mt-4 text-lg text-[#E8E8E8]">
                        {totalXP} <span className="text-sm text-[#9CA3AF]">Total XP</span>
                    </p>
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
                    <StatCard
                        label="Current Streak"
                        value={stats?.current_streak || 0}
                        unit=" days"
                        icon={<Flame className="h-8 w-8" />}
                    />
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
