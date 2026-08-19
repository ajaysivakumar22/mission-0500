'use client';

import { MEDALS } from '@/lib/constants/medals';
import { Medal as MedalIcon, Lock, Award, Shield, CheckCircle2 } from 'lucide-react';
import type { Medal } from '@/lib/constants/medals';

interface MedalsClientProps {
    earnedMedals: { medal_id: string; earned_at: string }[];
}

export default function MedalsClient({ earnedMedals }: MedalsClientProps) {
    const earnedMedalIds = new Set(earnedMedals.map(m => m.medal_id));
    const totalMedals = MEDALS.length;
    const earnedCount = earnedMedalIds.size;
    const completionPercentage = Math.round((earnedCount / totalMedals) * 100);

    const earnedList = MEDALS.filter(m => earnedMedalIds.has(m.id));
    const lockedList = MEDALS.filter(m => !earnedMedalIds.has(m.id));

    return (
        <div className="space-y-8 animate-slide-in">
            {/* Page Header */}
            <div className="border-b border-border pb-4">
                <span className="font-mono-tech text-xs font-bold text-accent uppercase tracking-widest block mb-1">
                    SERVICE RECORD
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-quote font-bold text-textMain tracking-tight">
                    Commendations Rack
                </h1>
                <p className="text-xs text-textSecondary mt-1">
                    Recognizing relentless execution, daily consistency, and operational discipline.
                </p>
            </div>

            {/* Commendations Overview Banner */}
            <div className="card p-6 border-l-4 border-l-[#D6A52C] bg-gradient-to-r from-surface to-surface-muted">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-xl bg-[#D6A52C]/20 text-[#D6A52C] flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Award className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="font-mono-tech text-[10px] text-textMuted uppercase tracking-widest block">
                                COMMENDATION PROGRESS
                            </span>
                            <h2 className="text-xl font-bold text-textMain">Medals Acquired</h2>
                        </div>
                    </div>

                    <div className="text-left sm:text-right font-mono-tech">
                        <span className="text-3xl font-black text-accent tabular-nums">{earnedCount}</span>
                        <span className="text-sm text-textMuted font-normal"> / {totalMedals}</span>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono-tech text-textMuted">
                        <span>Clearance Completion</span>
                        <span className="font-bold text-accent">{completionPercentage}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-surface-muted overflow-hidden border border-border">
                        <div
                            className="h-full bg-accent rounded-full transition-all duration-700"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Section 1: Earned Commendations (Highlighted) */}
            {earnedList.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-l-accent pl-3 py-0.5">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                            Earned Commendations ({earnedList.length})
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {earnedList.map((medal: Medal) => {
                            const earnedData = earnedMedals.find(m => m.medal_id === medal.id);
                            return (
                                <div
                                    key={medal.id}
                                    className="card p-5 border-accent/40 bg-surface shadow-elevated hover-lift flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#D6A52C] bg-[#D6A52C]/10 text-3xl shadow-sm">
                                                {medal.icon}
                                            </div>
                                            <span className="inline-block rounded-full bg-accent-muted px-2.5 py-0.5 text-[10px] font-mono-tech font-bold text-accent">
                                                EARNED
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-base text-textMain mb-1">
                                            {medal.name}
                                        </h3>
                                        <p className="text-xs text-textSecondary leading-relaxed mb-4">
                                            {medal.description}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono-tech text-textMuted">
                                        <span>AWARDED DATE:</span>
                                        <span className="font-bold text-accent">
                                            {new Date(earnedData!.earned_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Section 2: Locked Commendations (Aspirational Silhouettes) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-l-4 border-l-textMuted pl-3 py-0.5">
                    <Lock className="h-4 w-4 text-textMuted" />
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                        Locked Commendations ({lockedList.length})
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {lockedList.map((medal: Medal) => (
                        <div
                            key={medal.id}
                            className="card-muted p-5 opacity-75 hover:opacity-100 transition-all border border-border flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-textMuted">
                                        <Lock className="h-5 w-5 text-textMuted" />
                                    </div>
                                    <span className="inline-block rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-mono-tech text-textMuted border border-border">
                                        LOCKED
                                    </span>
                                </div>

                                <h3 className="font-bold text-sm text-textMain mb-1">
                                    {medal.name}
                                </h3>
                                <p className="text-xs text-textMuted leading-relaxed mb-3">
                                    {medal.description}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-border/50 text-[10px] font-mono-tech text-textMuted">
                                <span>STATUS: CLASSIFIED</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
