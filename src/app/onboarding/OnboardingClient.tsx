'use client';

import React, { useState } from 'react';
import { updateUserSettings } from '@/server/actions/settings';
import { createGoal } from '@/server/actions/goals';
import { initializeRoutineFromTemplate } from '@/server/actions/routine';
import { ROUTINE_TEMPLATES, type ArchetypeKey } from '@/lib/constants/xp-config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Target, FileSignature, CheckCircle, BookOpen, Rocket, Dumbbell } from 'lucide-react';

const ARCHETYPE_ICONS = {
    Shield,
    BookOpen,
    Rocket,
    Dumbbell,
} as const;

interface Props {
    userId: string;
}

export default function OnboardingClient({ userId }: Props) {
    const [step, setStep] = useState(1);
    const [archetype, setArchetype] = useState<ArchetypeKey>('operator');
    const [goalTitle, setGoalTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleArchetypeSelect = (key: ArchetypeKey) => {
        setArchetype(key);
        setStep(2);
    };

    const handleGoalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!goalTitle.trim()) return;
        setStep(3);
    };

    const signContract = async () => {
        setLoading(true);
        try {
            await createGoal(userId, {
                title: goalTitle,
                description: 'Primary Directive established during onboarding.',
                category: 'long_term',
            });

            await initializeRoutineFromTemplate(userId, archetype);

            const result = await updateUserSettings(userId, {
                theme: 'operator',
                onboarding_completed: true
            });

            if (!result.success) {
                await updateUserSettings(userId, { theme: 'operator' });
            }

            window.location.href = '/dashboard';
        } catch {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-textMain flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-surface p-8 rounded-2xl border border-border shadow-elevated relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D6A52C]"></div>

                {/* Step Indicators */}
                <div className="flex justify-between items-center mb-8 px-6 relative">
                    <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-border -z-0"></div>

                    {[
                        { num: 1, icon: Shield, label: 'Archetype' },
                        { num: 2, icon: Target, label: 'Directive' },
                        { num: 3, icon: FileSignature, label: 'Contract' }
                    ].map((s) => (
                        <div key={s.num} className="flex flex-col items-center bg-surface px-3 relative z-10">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                                step >= s.num
                                    ? 'border-[#20382B] bg-[#20382B] text-[#D6A52C]'
                                    : 'border-border bg-surface-muted text-textMuted'
                            }`}>
                                <s.icon className="w-4 h-4" />
                            </div>
                            <span className={`text-[10px] mt-1.5 uppercase font-mono-tech font-bold tracking-widest ${
                                step >= s.num ? 'text-[#20382B]' : 'text-textMuted'
                            }`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Archetype Selection */}
                {step === 1 && (
                    <div className="animate-slide-in text-center">
                        <span className="font-mono-tech text-[10px] text-accent uppercase tracking-widest block mb-1">STEP 01</span>
                        <h2 className="text-2xl font-bold text-textMain mb-1">Choose Your Operating Profile</h2>
                        <p className="text-xs text-textSecondary mb-6">Select your initial routine template.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                            {(Object.entries(ROUTINE_TEMPLATES) as [ArchetypeKey, typeof ROUTINE_TEMPLATES[ArchetypeKey]][]).map(([key, template]) => {
                                const IconComponent = ARCHETYPE_ICONS[template.icon as keyof typeof ARCHETYPE_ICONS];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleArchetypeSelect(key)}
                                        className="p-5 card-muted hover:border-accent hover:bg-surface transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            {IconComponent && <IconComponent className="w-5 h-5 text-accent" />}
                                            <h3 className="text-base font-bold text-textMain group-hover:text-accent uppercase tracking-wide">{template.label}</h3>
                                        </div>
                                        <p className="text-xs text-textSecondary mb-3 leading-relaxed">{template.description}</p>
                                        <div className="text-[11px] text-textMuted space-y-0.5 font-mono-tech">
                                            {template.items.slice(0, 3).map((item, i) => (
                                                <div key={i} className="flex items-center gap-1.5">
                                                    <span className="w-1 h-1 rounded-full bg-accent"></span>
                                                    {item.name}
                                                </div>
                                            ))}
                                            <div className="text-textMuted/70">+ {template.items.length - 3} more</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 2: Primary Directive */}
                {step === 2 && (
                    <form onSubmit={handleGoalSubmit} className="animate-slide-in text-center">
                        <span className="font-mono-tech text-[10px] text-accent uppercase tracking-widest block mb-1">STEP 02</span>
                        <h2 className="text-2xl font-bold text-textMain mb-1">Declare Primary Directive</h2>
                        <p className="text-xs text-textSecondary mb-6">What single objective must you conquer over the next 90 days?</p>

                        <div className="mb-6">
                            <Input
                                value={goalTitle}
                                onChange={(e) => setGoalTitle(e.target.value)}
                                placeholder="e.g. Launch certification, Complete 10k run, Finish codebase"
                                className="text-center text-lg py-4"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                            <Button type="submit" disabled={!goalTitle.trim()}>Lock In Directive</Button>
                        </div>
                    </form>
                )}

                {/* Step 3: The Contract */}
                {step === 3 && (
                    <div className="animate-slide-in text-center">
                        <span className="font-mono-tech text-[10px] text-accent uppercase tracking-widest block mb-1">STEP 03</span>
                        <h2 className="text-2xl font-bold text-textMain mb-1">The Accountability Contract</h2>
                        <p className="text-xs text-textSecondary mb-6">Daily discipline is non-negotiable.</p>

                        <div className="card-muted p-5 mb-6 text-left space-y-3 border-l-4 border-l-accent">
                            <p className="text-xs text-textMain leading-relaxed font-mono-tech">
                                Primary Directive: <strong className="text-accent block text-sm mt-0.5 font-sans font-bold">{goalTitle}</strong>
                            </p>
                            <p className="text-xs text-textSecondary leading-relaxed">
                                I commit to daily execution. I will track my non-negotiable routines and execute my objectives consistently.
                            </p>
                            <div className="flex items-center gap-1.5 text-accent font-mono-tech text-[11px] pt-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Binding accountability commitment.
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <Button type="button" variant="ghost" onClick={() => setStep(2)}>Edit Directive</Button>
                            <Button
                                onClick={signContract}
                                disabled={loading}
                                variant="primary"
                            >
                                {loading ? 'Initializing Interface...' : 'Sign Contract & Deploy'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}