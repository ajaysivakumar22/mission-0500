'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { VisionBoardGrid } from '@/components/ui/VisionBoardGrid';
import { MorningBriefingModal } from '@/components/ui/MorningBriefingModal';
import { StatCard } from '@/components/cards/StatCard';
import { getRankEmoji, RANK_THRESHOLDS, getXPForNextRank } from '@/lib/utils/xp';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { DisciplineHeatmap } from '@/components/ui/DisciplineHeatmap';
import { Zap, Target, Award, RotateCcw, CheckSquare, Flame, Shield, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DashboardStats } from '@/types';
import type { Rank } from '@/lib/utils/xp';

interface DashboardClientProps {
    userId: string;
    stats: DashboardStats | null;
    totalXP: number;
    rank: Rank;
    heatmapData?: { date: string; value: number }[];
    hasTodayObjective?: boolean;
}

const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function DashboardClient({ userId, stats, totalXP, rank, heatmapData, hasTodayObjective }: DashboardClientProps) {
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
            <MorningBriefingModal userId={userId} hasTodayObjective={hasTodayObjective} />
            <motion.div 
                variants={containerVars}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <PageHeader
                    title="Command Headquarters"
                    subtitle="Welcome back, future Officer. Review your stats and prepare for the day's mission."
                />

                <motion.div variants={itemVars} className="mb-8">
                    <VisionBoardGrid />
                </motion.div>
                
                {/* 30-Day Discipline Heatmap */}
                {heatmapData && heatmapData.length > 0 && (
                    <motion.div variants={itemVars} className="mb-8">
                        <DisciplineHeatmap data={heatmapData} />
                    </motion.div>
                )}

                {/* Rank Section */}
                <motion.div 
                    variants={itemVars}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black/40 to-[#102a1b]/40 backdrop-blur-2xl p-8 text-center shadow-2xl"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FFD60A]/10 rounded-full blur-[80px]"></div>

                    <motion.div 
                        animate={{ y: [0, -10, 0] }} 
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="text-6xl mb-6 drop-shadow-2xl flex justify-center"
                    >
                        {getRankEmoji(rank)}
                    </motion.div>
                    
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-[#FFD60A]" />
                        <p className="text-sm font-bold tracking-widest text-[#9CA3AF] uppercase">Current Rank</p>
                        <Shield className="h-5 w-5 text-[#FFD60A]" />
                    </div>
                    
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 drop-shadow-sm uppercase tracking-tight mb-10">
                        {rank}
                    </div>

                    {/* Progress to Next Rank */}
                    <div className="max-w-xl mx-auto relative group">
                        <div className="flex justify-between items-end mb-3 px-1">
                            <div className="text-left">
                                <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Total Experience</p>
                                <p className="text-2xl font-black text-white flex items-center gap-1">
                                    <Zap className="h-5 w-5 text-[#FFD60A]" /> {totalXP}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Next: {nextRankName}</p>
                                <p className="text-sm font-bold text-white/90">
                                    {progressXP} / {requiredXP} XP
                                </p>
                            </div>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-5 rounded-full bg-black/60 border border-white/5 overflow-hidden relative shadow-inner">
                            {/* Inner Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFD60A]/80 to-[#FFD60A] shadow-[0_0_15px_rgba(255,214,10,0.4)] relative"
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
                            </motion.div>
                        </div>
                        <p className="mt-4 text-xs text-center text-white/40 font-medium tracking-wide">
                            {progressPercentage === 100 ? 'Promotion available!' : `${100 - Math.round(progressPercentage)}% remaining until promotion`}
                        </p>
                    </div>
                </motion.div>

                {/* Key Stats Grid */}
                <motion.div variants={containerVars} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <motion.div variants={itemVars}>
                        <StatCard
                            label="Routine Completion"
                            value={stats?.routine_completion_percentage?.toFixed(0) || '0'}
                            unit="%"
                            icon={<RotateCcw className="h-8 w-8 text-blue-400" />}
                        />
                    </motion.div>
                    <motion.div variants={itemVars}>
                        <StatCard
                            label="Tasks Completed"
                            value={stats?.task_completion_percentage?.toFixed(0) || '0'}
                            unit="%"
                            icon={<CheckSquare className="h-8 w-8 text-green-400" />}
                        />
                    </motion.div>
                    
                    <motion.div variants={itemVars} className="h-full">
                        <div className="h-full bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 backdrop-blur-md p-6">
                            <InspirationalQuote />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVars} className={`relative ${isBurning ? 'animate-pulse' : ''}`}>
                        {isBurning && <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-3xl"></div>}
                        <StatCard
                            label="Current Streak"
                            value={stats?.current_streak || 0}
                            unit=" days"
                            icon={<Flame className={`h-8 w-8 ${hasActiveStreak ? (isBurning ? 'text-orange-500 animate-bounce' : 'text-[#FFD60A]') : 'text-gray-500'}`} />}
                        />
                    </motion.div>
                    <motion.div variants={itemVars}>
                        <StatCard
                            label="Daily XP"
                            value={totalXP}
                            icon={<Zap className="h-8 w-8 text-[#FFD60A]" />}
                        />
                    </motion.div>
                    <motion.div variants={itemVars}>
                        <StatCard
                            label="Rank Progress"
                            value={rank}
                            icon={<Award className="h-8 w-8 text-purple-400" />}
                        />
                    </motion.div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVars} className="rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl p-8">
                    <h3 className="mb-6 text-xl font-bold text-white tracking-wide">Quick Deployments</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <Link href="/routine" className="group rounded-xl border border-white/5 bg-white/5 px-6 py-4 text-center font-medium text-white hover:bg-white/10 hover:scale-105 transition-all">
                            <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform">📋</div>
                            Routine
                        </Link>
                        <Link href="/tasks" className="group rounded-xl border border-white/5 bg-white/5 px-6 py-4 text-center font-medium text-white hover:bg-white/10 hover:scale-105 transition-all">
                            <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform">✓</div>
                            Tasks
                        </Link>
                        <Link href="/goals" className="group rounded-xl border border-white/5 bg-white/5 px-6 py-4 text-center font-medium text-white hover:bg-white/10 hover:scale-105 transition-all">
                            <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform">🎯</div>
                            Goals
                        </Link>
                        <Link href="/report" className="group rounded-xl border border-white/5 bg-white/5 px-6 py-4 text-center font-medium text-white hover:bg-white/10 hover:scale-105 transition-all">
                            <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform">📝</div>
                            Report
                        </Link>
                        <Link href="/settings" className="group rounded-xl border border-white/5 bg-white/5 px-6 py-4 text-center font-medium text-white hover:bg-white/10 hover:scale-105 transition-all">
                            <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform">⚙️</div>
                            Settings
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </MainLayout>
    );
}
