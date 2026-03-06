'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
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
            // Create Primary Directive
            await createGoal(userId, {
                title: goalTitle,
                description: 'Primary Directive established during onboarding.',
                category: 'long_term',
            });

            // Initialize routines from selected archetype template
            await initializeRoutineFromTemplate(userId, archetype);

            // Mark onboarding completed and set theme
            const result = await updateUserSettings(userId, {
                theme: 'dark',
                onboarding_completed: true
            });

            // If the update failed (column missing), try without onboarding_completed
            if (!result.success) {
                await updateUserSettings(userId, { theme: 'dark' });
            }

            // Use window.location for a full page reload to pick up server-side changes
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Failed Onboarding', error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#0B1D13] p-8 rounded-2xl border border-[#1E3A2A] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD60A] to-transparent opacity-50"></div>
                
                {/* Step Indicators */}
                <div className="flex justify-between items-center mb-10 px-8 relative">
                    <div className="absolute top-1/2 left-10 right-10 h-[2px] bg-[#1E3A2A] -z-10"></div>
                    
                    {[
                        { num: 1, icon: Shield, label: 'Archetype' },
                        { num: 2, icon: Target, label: 'Directive' },
                        { num: 3, icon: FileSignature, label: 'Contract' }
                    ].map((s) => (
                        <div key={s.num} className="flex flex-col items-center bg-[#0B1D13] px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                                ${step >= s.num ? 'border-[#FFD60A] bg-[#162B20] text-[#FFD60A]' : 'border-[#1E3A2A] bg-background text-[#9CA3AF]'}`}>
                                <s.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] mt-2 uppercase tracking-widest font-bold ${step >= s.num ? 'text-[#FFD60A]' : 'text-[#9CA3AF]'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Archetype Selection */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">Choose Your Archetype</h2>
                        <p className="text-[#9CA3AF] mb-8">Select your operating profile. This sets up your daily routine template.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(Object.entries(ROUTINE_TEMPLATES) as [ArchetypeKey, typeof ROUTINE_TEMPLATES[ArchetypeKey]][]).map(([key, template]) => {
                                const IconComponent = ARCHETYPE_ICONS[template.icon as keyof typeof ARCHETYPE_ICONS];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleArchetypeSelect(key)}
                                        className="p-6 border-2 border-[#1E3A2A] rounded-xl hover:border-[#FFD60A] transition text-left group bg-[#162B20]"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            {IconComponent && <IconComponent className="w-6 h-6 text-[#FFD60A] opacity-70 group-hover:opacity-100 transition" />}
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#FFD60A] uppercase">{template.label}</h3>
                                        </div>
                                        <p className="text-sm text-[#9CA3AF] mb-3">{template.description}</p>
                                        <div className="text-xs text-[#6B7280] space-y-0.5">
                                            {template.items.slice(0, 3).map((item, i) => (
                                                <div key={i} className="flex items-center gap-1.5">
                                                    <span className="w-1 h-1 rounded-full bg-[#FFD60A] opacity-50"></span>
                                                    {item.name}
                                                </div>
                                            ))}
                                            <div className="text-[#4B5563]">+ {template.items.length - 3} more...</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 2: Primary Directive */}
                {step === 2 && (
                    <form onSubmit={handleGoalSubmit} className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">Declare Primary Directive</h2>
                        <p className="text-[#9CA3AF] mb-8">What is your singular uncompromising goal for the next 90 days?</p>
                        
                        <div className="mb-8">
                            <Input 
                                value={goalTitle}
                                onChange={(e) => setGoalTitle(e.target.value)}
                                placeholder="e.g. Add $10,000 MRR, Run a Marathon, Finish the App"
                                className="text-center text-xl py-6"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-between">
                            <Button type="button" variant="ghost" onClick={() => setStep(1)}>Pull Back</Button>
                            <Button type="submit" disabled={!goalTitle.trim()}>Lock In Directive</Button>
                        </div>
                    </form>
                )}

                {/* Step 3: The Contract */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">The Accountability Contract</h2>
                        <p className="text-[#9CA3AF] mb-6">Execution is not negotiable. Motivation is a myth.</p>
                        
                        <div className="bg-[#162B20] border border-red-900/30 rounded-xl p-6 mb-8 text-left space-y-4 shadow-inner">
                            <p className="font-mono text-sm leading-relaxed text-[#D1D5DB]">
                                I hereby commit to pursuing my Primary Directive: <strong className="text-[#FFD60A] block text-lg mt-1">{goalTitle}</strong>
                            </p>
                            <p className="font-mono text-sm leading-relaxed text-[#D1D5DB] border-l-2 border-[#FFD60A] pl-4">
                                I understand that success requires daily, relentless execution. 
                                I will log in daily. I will execute my routines. I will disregard my feelings in favor of my duties.
                            </p>
                            <div className="flex items-center gap-2 text-red-500 font-mono text-xs mt-4">
                                <CheckCircle className="w-4 h-4" /> This contract is binding.
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button type="button" variant="ghost" onClick={() => setStep(2)}>Review Directive</Button>
                            <Button 
                                onClick={signContract} 
                                disabled={loading}
                                className="bg-red-700 hover:bg-red-800 text-white font-bold tracking-widest uppercase border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
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