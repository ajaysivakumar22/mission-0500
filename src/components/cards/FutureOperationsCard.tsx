'use client';

import React from 'react';
import { Lock, Utensils, Zap, Flame, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export function FutureOperationsCard() {
    const { toast } = useToast();

    const handleLockedModuleClick = () => {
        toast('MODULE LOCKED — Nutrition intelligence will be activated in a future operational milestone.', 'warning');
    };

    return (
        <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-xs font-bold text-textMuted uppercase tracking-widest">
                        FUTURE OPERATIONS
                    </span>
                </div>
                <span className="text-[10px] font-mono-tech text-accent font-bold uppercase tracking-wider bg-accent-muted border border-accent/20 px-2 py-0.5 rounded">
                    MODULE PREVIEW
                </span>
            </div>

            {/* Nutrition Log Locked Preview Module */}
            <div
                onClick={handleLockedModuleClick}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-muted/80 to-surface border border-border hover:border-accent hover-lift p-4 transition-all duration-200 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleLockedModuleClick();
                    }
                }}
            >
                {/* Subtle Backdrop Pattern */}
                <div className="absolute top-2 right-2 text-textMuted/10 group-hover:text-accent/10 transition-colors pointer-events-none">
                    <Utensils className="h-24 w-24" />
                </div>

                <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#20382B] text-[#D6A52C] flex items-center justify-center shadow-md">
                                <Utensils className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-textMain tracking-wide uppercase">
                                        NUTRITION LOG
                                    </h3>
                                    <span className="inline-flex items-center gap-1 rounded bg-[#20382B] px-1.5 py-0.5 text-[9px] font-mono-tech font-bold text-[#D6A52C]">
                                        <Lock className="h-2.5 w-2.5" /> PROTOCOL 0600
                                    </span>
                                </div>
                                <p className="text-[11px] text-textMuted font-mono-tech">
                                    Caloric &amp; Fuel Intelligence System
                                </p>
                            </div>
                        </div>

                        <div className="h-8 w-8 rounded-lg bg-accent-muted text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-[#20382B] transition-colors">
                            <Lock className="h-4 w-4" />
                        </div>
                    </div>

                    {/* Mock Nutrient Fuel Telemetry (Blurred/Obscured) */}
                    <div className="pt-2 border-t border-border/40 grid grid-cols-3 gap-2 opacity-75">
                        <div className="card-muted p-2 rounded-lg text-center">
                            <span className="text-[9px] font-mono-tech text-textMuted uppercase block">PROTEIN</span>
                            <span className="text-xs font-bold font-mono-tech text-[#71866B]">160g / 180g</span>
                        </div>
                        <div className="card-muted p-2 rounded-lg text-center">
                            <span className="text-[9px] font-mono-tech text-textMuted uppercase block">CARBS</span>
                            <span className="text-xs font-bold font-mono-tech text-[#58718A]">210g / 250g</span>
                        </div>
                        <div className="card-muted p-2 rounded-lg text-center">
                            <span className="text-[9px] font-mono-tech text-textMuted uppercase block">FATS</span>
                            <span className="text-xs font-bold font-mono-tech text-[#B85C3D]">60g / 70g</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono-tech text-textMuted pt-1">
                        <span className="flex items-center gap-1 text-accent font-bold">
                            <Zap className="h-3 w-3" /> Upcoming Milestone
                        </span>
                        <span className="group-hover:text-textMain transition-colors">
                            Click to inspect status →
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
