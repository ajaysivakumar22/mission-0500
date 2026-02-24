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
import { createGoal, deleteGoal, archiveGoal } from '@/server/actions/goals';
import { Plus, Target } from 'lucide-react';
import type { Goal } from '@/types';

interface GoalsClientProps {
    userId: string;
    initialGoals: Goal[];
}

export default function GoalsClient({ userId, initialGoals }: GoalsClientProps) {
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
            alert('Please enter a goal title');
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
            alert(result.error || 'Failed to create goal');
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

                <InspirationalQuote
                    quote="I decided to become an Air Force Officer. I don't care if I die for it."
                    author="Monkey D. Luffy"
                    context="(Adapted)"
                    bgImageUrl="https://images.unsplash.com/photo-1544894389-724d2da632bd?q=80&w=2670&auto=format&fit=crop"
                />

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
                    <h2 className="mb-4 text-xl font-bold text-[#E8E8E8]">
                        Short-term Goals ({categorized.short_term.length})
                    </h2>
                    <div className="space-y-3">
                        {categorized.short_term.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-center backdrop-blur-sm">
                                <Target className="h-6 w-6 text-[#9CA3AF] mx-auto mb-2 opacity-50" />
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
                    <h2 className="mb-4 text-xl font-bold text-[#E8E8E8]">
                        Mid-term Goals ({categorized.mid_term.length})
                    </h2>
                    <div className="space-y-3">
                        {categorized.mid_term.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-center backdrop-blur-sm">
                                <Target className="h-6 w-6 text-[#9CA3AF] mx-auto mb-2 opacity-50" />
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
                    <h2 className="mb-4 text-xl font-bold text-[#E8E8E8]">
                        Long-term Goals ({categorized.long_term.length})
                    </h2>
                    <div className="space-y-3">
                        {categorized.long_term.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-center backdrop-blur-sm">
                                <Target className="h-6 w-6 text-[#9CA3AF] mx-auto mb-2 opacity-50" />
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
