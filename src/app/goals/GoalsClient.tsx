'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { GoalCard } from '@/components/cards/GoalCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { createGoal, deleteGoal, archiveGoal } from '@/server/actions/goals';
import { Plus, Target } from 'lucide-react';
import type { Goal } from '@/types';

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

    // Group goals by category
    const categorized = {
        short_term: goals.filter(g => g.category === 'short_term'),
        mid_term: goals.filter(g => g.category === 'mid_term'),
        long_term: goals.filter(g => g.category === 'long_term'),
    };

    return (
        <MainLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    title="Strategic Objectives"
                    subtitle="Define your targets. Relentlessly pursue them until victory is achieved."
                />

                <InspirationalQuote />

                {!isPremium ? (
                    <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-surface p-10 text-center shadow-[0_0_50px_rgba(var(--theme-accent),0.1)] backdrop-blur-md animate-in zoom-in duration-500">
                        {/* Glowing background */}
                        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-10 blur-[100px]"></div>

                        <div className="relative z-10 flex flex-col items-center py-8">
                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-accent bg-background shadow-[0_0_40px_rgba(var(--theme-accent),0.2)]">
                                <Target className="h-12 w-12 text-accent" />
                            </div>

                            <h2 className="mb-4 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-white uppercase tracking-widest">
                                STRATEGIC COMMAND LOCKED
                            </h2>
                            <p className="mx-auto mb-10 max-w-xl text-lg font-medium text-textMuted leading-relaxed">
                                True power requires long-term vision. The Goals Protocol is restricted to <span className="text-accent">Elite Status</span> operators. Upgrade now to build your multi-year deployment strategy.
                            </p>

                            <Button
                                variant="primary"
                                className="px-10 py-5 text-xl font-black tracking-widest uppercase shadow-[0_0_20px_rgba(var(--theme-accent),0.3)] hover:shadow-[0_0_40px_rgba(var(--theme-accent),0.5)] transition-all hover:scale-105"
                                onClick={() => window.location.href = '/settings?tab=elite'}
                            >
                                Initiate Elite Upgrade
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Add Button */}
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            variant="primary"
                            className="w-full gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Create New Goal
                        </Button>

                        {/* Short-term Goals */}
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-textMain relative inline-block">
                                Short-term Goals
                                <span className="ml-2 rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent align-middle">{categorized.short_term.length}</span>
                            </h2>
                            <div className="space-y-3">
                                {categorized.short_term.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-center backdrop-blur-sm">
                                        <Target className="h-6 w-6 text-textMuted mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-bold text-white uppercase tracking-wider">No Short-Term Objectives</p>
                                    </div>
                                ) : (
                                    categorized.short_term.map(goal => (
                                        <GoalCard
                                            key={goal.id}
                                            goal={goal}
                                            onDelete={handleDeleteGoal}
                                            onArchive={handleArchiveGoal}
                                        />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Mid-term Goals */}
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-textMain relative inline-block">
                                Mid-term Goals
                                <span className="ml-2 rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent align-middle">{categorized.mid_term.length}</span>
                            </h2>
                            <div className="space-y-3">
                                {categorized.mid_term.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-center backdrop-blur-sm">
                                        <Target className="h-6 w-6 text-textMuted mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-bold text-white uppercase tracking-wider">No Mid-Term Objectives</p>
                                    </div>
                                ) : (
                                    categorized.mid_term.map(goal => (
                                        <GoalCard
                                            key={goal.id}
                                            goal={goal}
                                            onDelete={handleDeleteGoal}
                                            onArchive={handleArchiveGoal}
                                        />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Long-term Goals */}
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-textMain relative inline-block">
                                Long-term Goals
                                <span className="ml-2 rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent align-middle">{categorized.long_term.length}</span>
                            </h2>
                            <div className="space-y-3">
                                {categorized.long_term.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-center backdrop-blur-sm">
                                        <Target className="h-6 w-6 text-textMuted mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-bold text-white uppercase tracking-wider">No Long-Term Objectives</p>
                                    </div>
                                ) : (
                                    categorized.long_term.map(goal => (
                                        <GoalCard
                                            key={goal.id}
                                            goal={goal}
                                            onDelete={handleDeleteGoal}
                                            onArchive={handleArchiveGoal}
                                        />
                                    ))
                                )}
                            </div>
                        </section>
                    </>
                )}

                {/* Dialog */}
                <Dialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="Create New Goal"
                    footer={
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => handleAddGoal()}
                                className="flex-1"
                            >
                                Create
                            </Button>
                        </>
                    }
                >
                    <form onSubmit={handleAddGoal} className="space-y-4">
                        <Input
                            label="Goal Title"
                            placeholder="e.g., Complete certification"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <Textarea
                            label="Description"
                            placeholder="Describe your goal..."
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                        />
                        <Select
                            label="Category"
                            value={formData.category}
                            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                            options={[
                                { value: 'short_term', label: 'Short-term (< 3 months)' },
                                { value: 'mid_term', label: 'Mid-term (3-6 months)' },
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
        </MainLayout>
    );
}
