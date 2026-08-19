'use client';

import { useState } from 'react';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { GoalCard } from '@/components/cards/GoalCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { createGoal, deleteGoal, archiveGoal } from '@/server/actions/goals';
import { Plus, Target, Lock, Compass, Mountain, MapPin, Flag } from 'lucide-react';
import type { Goal } from '@/types';
import { OperationalDate } from '@/components/ui/OperationalDate';

interface GoalsClientProps {
    userId: string;
    initialGoals: Goal[];
    isPremium: boolean;
}

export default function GoalsClient({ userId, initialGoals, isPremium }: GoalsClientProps) {
    const { toast } = useToast();
    const [goals, setGoals] = useState<Goal[]>(initialGoals);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'short_term' as const,
        target_date: '',
    });

    const handleAddGoal = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!formData.title.trim()) {
            toast('Please enter a goal title', 'warning');
            return;
        }

        const result = await createGoal(userId, {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            target_date: formData.target_date,
        });

        if (result.success && result.data) {
            setGoals(prev => [...prev, result.data!]);
            setFormData({ title: '', description: '', category: 'short_term', target_date: '' });
            setIsDialogOpen(false);
        } else {
            toast(result.error || 'Failed to create goal', 'error');
        }
    };

    const handleArchiveGoal = async (id: string) => {
        const result = await archiveGoal(userId, id);
        if (result.success) {
            setGoals(prev => prev.filter(g => g.id !== id));
        }
    };

    const handleDeleteGoal = async (id: string) => {
        const result = await deleteGoal(userId, id);
        if (result.success) {
            setGoals(prev => prev.filter(g => g.id !== id));
        }
    };

    const categorized = {
        short_term: goals.filter(g => g.category === 'short_term'),
        mid_term: goals.filter(g => g.category === 'mid_term'),
        long_term: goals.filter(g => g.category === 'long_term'),
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                    <div className="mb-1">
                        <OperationalDate label="STRATEGIC COMMAND" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif-quote font-bold text-textMain tracking-tight">
                        Strategic Objectives
                    </h1>
                    <p className="text-xs text-textSecondary mt-1">
                        Choose the mountain before you start climbing.
                    </p>
                </div>
                {isPremium && (
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        variant="primary"
                        className="gap-2 self-start sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Declare Objective
                    </Button>
                )}
            </div>

            <InspirationalQuote compact pageKey="goals" />

            {!isPremium ? (
                /* Aspirational Locked State for Non-Premium */
                <div className="relative overflow-hidden rounded-2xl bg-[#20382B] text-[#F8F4EB] p-8 sm:p-12 border border-white/10 shadow-xl text-center space-y-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D6A52C]/20 text-[#D6A52C]">
                        <Mountain className="h-8 w-8" />
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                        <span className="font-mono-tech text-xs text-[#D6A52C] uppercase tracking-widest font-bold block">
                            ELITE CLEARANCE REQUIRED
                        </span>
                        <h2 className="text-2xl font-serif-quote font-bold text-white">
                            Strategic Campaign Unlocked
                        </h2>
                        <p className="text-xs text-white/70 leading-relaxed font-medium">
                            Multi-quarter directive mapping, short/mid/long term milestone tracking, and campaign progress telemetry are reserved for Elite status operators.
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/settings?tab=elite'}
                        className="bg-[#D6A52C] text-[#20382B] hover:bg-[#c49526] font-bold px-8 py-3 rounded-xl"
                    >
                        Initiate Elite Upgrade (₹100/mo)
                    </Button>
                </div>
            ) : (
                <div className="space-y-8">

                    {/* Section 1: Short-term Goals (Active Execution — Saffron #D6A52C) */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-l-4 border-l-[#D6A52C] pl-3 py-1">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#D6A52C]" />
                                <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                                    Short-Term Campaign (&lt; 90 Days)
                                </h2>
                            </div>
                            <span className="font-mono-tech text-xs font-bold text-accent bg-accent-muted px-2.5 py-0.5 rounded-md">
                                {categorized.short_term.length} Active
                            </span>
                        </div>

                        {categorized.short_term.length === 0 ? (
                            <div className="card-muted p-8 text-center space-y-2">
                                <Compass className="h-8 w-8 text-textMuted mx-auto opacity-60" />
                                <p className="text-sm font-bold text-textMain">No Short-Term Objectives</p>
                                <p className="text-xs text-textMuted max-w-sm mx-auto">
                                    Establish non-negotiable 90-day targets to maintain tactical velocity.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {categorized.short_term.map(goal => (
                                    <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} onArchive={handleArchiveGoal} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Section 2: Mid-term Goals (Planning — Dusty Blue #58718A) */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-l-4 border-l-[#58718A] pl-3 py-1">
                            <div className="flex items-center gap-2">
                                <Compass className="h-4 w-4 text-[#58718A]" />
                                <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                                    Mid-Term Deployment (3 - 6 Months)
                                </h2>
                            </div>
                            <span className="font-mono-tech text-xs font-bold text-[#58718A] bg-[#58718A]/15 px-2.5 py-0.5 rounded-md">
                                {categorized.mid_term.length} Planned
                            </span>
                        </div>

                        {categorized.mid_term.length === 0 ? (
                            <div className="card-muted p-8 text-center space-y-2">
                                <Flag className="h-8 w-8 text-textMuted mx-auto opacity-60" />
                                <p className="text-sm font-bold text-textMain">No Mid-Term Objectives</p>
                                <p className="text-xs text-textMuted max-w-sm mx-auto">
                                    Define mid-horizon targets that bridge daily routines to long-term vision.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {categorized.mid_term.map(goal => (
                                    <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} onArchive={handleArchiveGoal} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Section 3: Long-term Goals (Strategic — Deep Olive #20382B) */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-l-4 border-l-[#20382B] pl-3 py-1">
                            <div className="flex items-center gap-2">
                                <Mountain className="h-4 w-4 text-[#20382B]" />
                                <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                                    Long-Term Vision (&gt; 6 Months)
                                </h2>
                            </div>
                            <span className="font-mono-tech text-xs font-bold text-[#20382B] bg-[#20382B]/15 px-2.5 py-0.5 rounded-md">
                                {categorized.long_term.length} Visionary
                            </span>
                        </div>

                        {categorized.long_term.length === 0 ? (
                            <div className="card-muted p-8 text-center space-y-2">
                                <Mountain className="h-8 w-8 text-textMuted mx-auto opacity-60" />
                                <p className="text-sm font-bold text-textMain">No Long-Term Vision Declared</p>
                                <p className="text-xs text-textMuted max-w-sm mx-auto">
                                    Set multi-year North Star goals that shape your lifestyle choices.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {categorized.long_term.map(goal => (
                                    <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} onArchive={handleArchiveGoal} />
                                ))}
                            </div>
                        )}
                    </section>

                </div>
            )}

            {/* Create Goal Dialog */}
            <Dialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Declare Strategic Objective"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancel</Button>
                        <Button variant="primary" onClick={() => handleAddGoal()} className="flex-1">Lock In Goal</Button>
                    </>
                }
            >
                <form onSubmit={handleAddGoal} className="space-y-4">
                    <Input
                        label="Goal Title"
                        placeholder="e.g., Launch SaaS product, Run marathon"
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                        label="Description"
                        placeholder="Define success criteria..."
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                    />
                    <Select
                        label="Category"
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                        options={[
                            { value: 'short_term', label: 'Short-term (< 90 days)' },
                            { value: 'mid_term', label: 'Mid-term (3 - 6 months)' },
                            { value: 'long_term', label: 'Long-term (> 6 months)' },
                        ]}
                    />
                    <Input
                        label="Target Date (optional)"
                        type="date"
                        value={formData.target_date}
                        onChange={e => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
                    />
                </form>
            </Dialog>
        </div>
    );
}
