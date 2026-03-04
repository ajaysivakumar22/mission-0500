'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { MEDALS } from '@/lib/constants/medals';
import { Medal as MedalIcon, Lock } from 'lucide-react';
import type { Medal } from '@/lib/constants/medals';

interface MedalsClientProps {
    earnedMedals: { medal_id: string; earned_at: string }[];
}

export default function MedalsClient({ earnedMedals }: MedalsClientProps) {
    const earnedMedalIds = new Set(earnedMedals.map(m => m.medal_id));

    // Calculate progression
    const totalMedals = MEDALS.length;
    const earnedCount = earnedMedalIds.size;
    const completionPercentage = Math.round((earnedCount / totalMedals) * 100);

    return (
        <MainLayout>
            <div className="w-full space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    title="Commendations Rack"
                    subtitle="Elite operators are recognized for their relentless discipline and execution."
                />

                {/* Progress Overview */}
                <div className="rounded-2xl border border-[#FFD60A]/20 bg-gradient-to-br from-[#162B20] to-[#0B1D13] p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <MedalIcon className="h-8 w-8 text-[#FFD60A]" />
                            <h2 className="text-2xl font-black text-[#E8E8E8] uppercase tracking-widest">
                                Medals Acquired
                            </h2>
                        </div>
                        <span className="text-4xl font-black text-[#FFD60A] drop-shadow-md">
                            {earnedCount} <span className="text-xl text-[#6B7280]">/ {totalMedals}</span>
                        </span>
                    </div>

                    <div className="h-4 rounded-full bg-[#0B1D13] border border-[#1E3A2A] overflow-hidden relative">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFD60A]/80 to-[#FFD60A] transition-all duration-1000"
                            style={{ width: `${completionPercentage}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 blur-[2px] animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* The Rack Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {MEDALS.map((medal: Medal) => {
                        const isEarned = earnedMedalIds.has(medal.id);
                        const earnedData = earnedMedals.find(m => m.medal_id === medal.id);

                        return (
                            <div
                                key={medal.id}
                                className={`relative overflow-hidden rounded-2xl border transition-all duration-500 p-6 ${isEarned
                                        ? 'border-[#FFD60A]/40 bg-[#162B20]/90 shadow-[0_0_30px_rgba(255,214,10,0.1)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,214,10,0.2)]'
                                        : 'border-[#1E3A2A]/40 bg-[#0B1D13]/60 grayscale opacity-60'
                                    }`}
                            >
                                {/* Glowing Background Effect for Earned medals */}
                                {isEarned && (
                                    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${medal.color} opacity-20 blur-2xl`}></div>
                                )}

                                <div className="relative z-10 text-center">
                                    <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-xl ${isEarned ? 'border-[#FFD60A] bg-gradient-to-br ' + medal.color : 'border-[#1E3A2A] bg-[#162B20]'
                                        }`}>
                                        <span className="text-4xl drop-shadow-md">
                                            {isEarned ? medal.icon : <Lock className="h-8 w-8 text-[#6B7280]" />}
                                        </span>
                                    </div>

                                    <h3 className={`text-lg font-black uppercase tracking-wider mb-2 ${isEarned ? 'text-[#FFD60A]' : 'text-[#9CA3AF]'
                                        }`}>
                                        {medal.name}
                                    </h3>

                                    <p className="text-sm font-medium text-[#9CA3AF] mb-4 min-h-[40px]">
                                        {medal.description}
                                    </p>

                                    {isEarned ? (
                                        <div className="inline-block rounded-full bg-[#FFD60A]/10 px-3 py-1 text-xs font-bold text-[#FFD60A] border border-[#FFD60A]/20">
                                            EARNED ON {new Date(earnedData!.earned_at).toLocaleDateString()}
                                        </div>
                                    ) : (
                                        <div className="inline-block rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-[#6B7280] border border-[#1E3A2A]">
                                            LOCKED
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
}
