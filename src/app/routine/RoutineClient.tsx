'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RoutineCard } from '@/components/cards/RoutineCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import {
    addRoutineItem,
    updateRoutineItem,
    deleteRoutineItem,
} from '@/server/actions/routine';
import { Plus } from 'lucide-react';
import type { DailyRoutine } from '@/types';

interface RoutineClientProps {
    userId: string;
    initialRoutines: DailyRoutine[];
}

export default function RoutineClient({ userId, initialRoutines }: RoutineClientProps) {
    const [routines, setRoutines] = useState<DailyRoutine[]>(initialRoutines);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        item_name: '',
        notes: '',
    });

    const completedCount = routines.filter(r => r.is_completed).length;
    const completionPercentage = routines.length > 0
        ? Math.round((completedCount / routines.length) * 100)
        : 0;

    const handleAddRoutine = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!formData.item_name.trim()) {
            alert('Please enter a routine item name');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const result = await addRoutineItem(userId, {
            routine_date: today,
            item_name: formData.item_name,
            notes: formData.notes,
        });

        if (result.success && result.data) {
            setRoutines(prev => [...prev, result.data!]);
            setFormData({ item_name: '', notes: '' });
            setIsDialogOpen(false);
        } else {
            alert(result.error || 'Failed to add routine item');
        }
    };

    const handleToggleRoutine = async (id: string, completed: boolean) => {
        const result = await updateRoutineItem(userId, id, { is_completed: completed });

        if (result.success && result.data) {
            setRoutines(prev => prev.map(r => (r.id === id ? result.data! : r)));
        }
    };

    const handleDeleteRoutine = async (id: string) => {
        const result = await deleteRoutineItem(userId, id);

        if (result.success) {
            setRoutines(prev => prev.filter(r => r.id !== id));
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Completion Status */}
                <div className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#E8E8E8]">Today&apos;s Routine</h2>
                        <span className="text-3xl font-bold text-[#FFD60A]">{completionPercentage}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-[#0B1D13] overflow-hidden">
                        <div
                            className="h-full bg-[#FFD60A] transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    <p className="mt-2 text-sm text-[#9CA3AF]">
                        {completedCount} of {routines.length} completed
                    </p>
                </div>

                {/* Routine Items */}
                <div className="space-y-3">
                    {routines.length === 0 ? (
                        <p className="text-center text-[#9CA3AF]">No routine items for today</p>
                    ) : (
                        routines.map(routine => (
                            <RoutineCard
                                key={routine.id}
                                item={routine}
                                onToggle={handleToggleRoutine}
                                onDelete={handleDeleteRoutine}
                            />
                        ))
                    )}
                </div>

                {/* Add Button */}
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    variant="primary"
                    className="w-full gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add Routine Item
                </Button>

                {/* Add Dialog */}
                <Dialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="Add Routine Item"
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
                                onClick={() => handleAddRoutine()}
                                className="flex-1"
                            >
                                Add
                            </Button>
                        </>
                    }
                >
                    <form onSubmit={handleAddRoutine} className="space-y-4">
                        <Input
                            label="Routine Item"
                            placeholder="e.g., Morning run"
                            value={formData.item_name}
                            onChange={e => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
                        />
                        <Input
                            label="Notes (optional)"
                            placeholder="Add any notes..."
                            value={formData.notes}
                            onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                    </form>
                </Dialog>
            </div>
        </MainLayout>
    );
}
