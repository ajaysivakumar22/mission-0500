'use client';

import { MEDALS } from '@/lib/constants/medals';
import { Medal as MedalIcon, Lock, Award, Shield, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { Medal } from '@/lib/constants/medals';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { OperationalDate } from '@/components/ui/OperationalDate';
import { useToast } from '@/components/ui/Toast';

interface MedalsClientProps {
    earnedMedals: { medal_id: string; earned_at: string }[];
}

export default function MedalsClient({ earnedMedals }: MedalsClientProps) {
    const { toast } = useToast();
    const earnedMedalIds = new Set(earnedMedals.map(m => m.medal_id));
    const totalMedals = MEDALS.length;
    const earnedCount = earnedMedalIds.size;
    const completionPercentage = Math.round((earnedCount / totalMedals) * 100);

    const earnedList = MEDALS.filter(m => earnedMedalIds.has(m.id));
    const lockedList = MEDALS.filter(m => !earnedMedalIds.has(m.id));

    const handleLockedMedalClick = (medal: Medal) => {
        toast(`Classified Commendation [${medal.name}]: Complete operational requirements to unlock.`, 'info');
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="border-b border-border pb-4">
                <div className="mb-1">
                    <OperationalDate label="SERVICE RECORD & COMMENDATIONS" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif-quote font-bold text-textMain tracking-tight">
                    Commendations Rack
                </h1>
                <p className="text-xs text-textSecondary mt-1">
                    Recognizing relentless execution, daily consistency, and operational discipline.
                </p>
            </div>

            <InspirationalQuote compact pageKey="medals" />

            {/* Commendations Overview Banner */}
            <div className="card p-6 border-l-4 border-l-[#D6A52C] bg-gradient-to-r from-surface to-surface-muted">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-xl bg-[#D6A52C]/20 text-[#D6A52C] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D6A52C]/30">
                            <Award className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono-tech text-[10px] text-textMuted uppercase tracking-widest block">
                                    COMMENDATION PROGRESS
                                </span>
                                <span className="font-mono-tech text-[9px] bg-accent/15 text-accent px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                    CLEARANCE: {completionPercentage >= 100 ? 'COMMANDER' : completionPercentage >= 50 ? 'OFFICER' : 'CADET'}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-textMain">Medals &amp; Insignia Acquired</h2>
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
                                    className="card p-5 border-accent/40 bg-surface shadow-elevated hover-lift flex flex-col justify-between group relative overflow-hidden"
                                >
                                    {/* Insignia Background Watermark */}
                                    <div className="absolute -right-2 -bottom-2 text-4xl opacity-10 pointer-events-none select-none transition-transform group-hover:scale-110">
                                        {medal.icon}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#D6A52C] bg-[#D6A52C]/10 text-3xl shadow-sm">
                                                {medal.icon}
                                            </div>
                                            <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[10px] font-mono-tech font-bold text-accent">
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

                                    <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono-tech text-textMuted relative z-10">
                                        <span>AWARDED DATE:</span>
                                        <span className="font-bold text-accent">
                                            {earnedData ? new Date(earnedData.earned_at).toLocaleDateString() : 'ACTIVE'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Section 2: Locked Commendations (Classified Achievement Dossiers) */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-l-4 border-l-textMuted pl-3 py-0.5">
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-textMuted" />
                        <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                            Classified Commendations ({lockedList.length})
                        </h2>
                    </div>
                    <span className="text-[10px] font-mono-tech text-textMuted uppercase tracking-wider hidden sm:inline">
                        RESTRICTED DOSSIERS
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {lockedList.map((medal: Medal) => (
                        <div
                            key={medal.id}
                            onClick={() => handleLockedMedalClick(medal)}
                            className="card-muted p-5 cursor-pointer border border-border/80 hover:border-accent/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-b from-surface-muted/60 to-surface-muted/90"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleLockedMedalClick(medal)}
                            aria-label={`Locked medal: ${medal.name}`}
                        >
                            {/* Watermark Insignia Silhouette */}
                            <div className="absolute -right-3 -bottom-3 text-5xl opacity-10 group-hover:opacity-20 pointer-events-none select-none transition-all duration-300 filter grayscale group-hover:grayscale-0">
                                {medal.icon}
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-textMuted group-hover:text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-200">
                                        <Lock className="h-5 w-5 transition-colors" />
                                    </div>
                                    <span className="inline-block rounded-full bg-surface px-2.5 py-0.5 text-[9px] font-mono-tech text-textMuted border border-border group-hover:border-accent/30 group-hover:text-accent font-bold transition-all">
                                        CLASSIFIED
                                    </span>
                                </div>

                                <h3 className="font-bold text-sm text-textMain mb-1 group-hover:text-accent transition-colors">
                                    {medal.name}
                                </h3>
                                <p className="text-xs text-textMuted leading-relaxed mb-3">
                                    {medal.description}
                                </p>
                            </div>

                            <div className="pt-2.5 border-t border-border/60 text-[10px] font-mono-tech text-textMuted flex items-center justify-between relative z-10">
                                <span className="uppercase tracking-wider">TARGET:</span>
                                <span className="font-bold text-accent/80 group-hover:text-accent transition-colors">
                                    {medal.requirement_value} {medal.requirement_type.replace(/_/g, ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
