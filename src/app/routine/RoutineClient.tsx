'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { RoutineCard } from '@/components/cards/RoutineCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import {
    addRoutineItem,
    updateRoutineItem,
    deleteRoutineItem,
} from '@/server/actions/routine';
import { Plus, RotateCcw } from 'lucide-react';
import type { DailyRoutine } from '@/types';

interface RoutineClientProps {
    userId: string;
    initialRoutines: DailyRoutine[];
}

export default function RoutineClient({ userId, initialRoutines }: RoutineClientProps) {
    const { toast } = useToast();
    const [routines, setRoutines] = useState<DailyRoutine[]>(initialRoutines);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DailyRoutine | null>(null);
    const [formData, setFormData] = useState({ item_name: '', notes: '' });

    const completedCount = routines.filter(r => r.is_completed).length;
    const completionPercentage = routines.length > 0
        ? Math.round((completedCount / routines.length) * 100)
        : 0;

    const handleAddRoutine = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!formData.item_name.trim()) {
            toast('Please enter a routine item name', 'warning');
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
            toast(result.error || 'Failed to add routine item', 'error');
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

    const openDialog = (item?: DailyRoutine) => {
        if (item) {
            setEditingItem(item);
            setFormData({ item_name: item.item_name, notes: item.notes || '' });
        } else {
            setEditingItem(null);
            setFormData({ item_name: '', notes: '' });
        }
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6 animate-slide-in">
            <InspirationalQuote />

            {/* Progress Summary */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs font-mono-tech text-textMuted uppercase tracking-widest mb-0.5">Today&apos;s Routine</p>
                        <p className="text-sm text-textSecondary">
                            {completedCount} of {routines.length} completed
                        </p>
                    </div>
                    <span className="text-3xl font-black text-accent tabular-nums">
                        {completionPercentage}%
                    </span>
                </div>
                <div className="h-2 rounded-full bg-surface-muted overflow-hidden">
                    <motion.div
                        className="h-full bg-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Routine Items */}
            <div className="card overflow-hidden">
                <motion.div layout className="divide-y divide-border">
                    <AnimatePresence mode="popLayout">
                        {routines.length === 0 ? (
                            <motion.div
                                key="empty-state"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="py-16 text-center"
                            >
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted">
                                    <RotateCcw className="h-5 w-5 text-textMuted" />
                                </div>
                                <h3 className="mb-1 font-semibold text-textMain">No routine yet</h3>
                                <p className="text-sm text-textMuted max-w-xs mx-auto">
                                    Consistency compounds. Add your first non-negotiable daily action.
                                </p>
                            </motion.div>
                        ) : (
                            [...routines]
                                .sort((a, b) => Number(a.is_completed) - Number(b.is_completed))
                                .map(routine => (
                                    <RoutineCard
                                        key={routine.id}
                                        item={routine}
                                        onToggle={handleToggleRoutine}
                                        onDelete={handleDeleteRoutine}
                                        onEdit={openDialog}
                                    />
                                ))
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Add Button */}
            <Button
                onClick={() => openDialog()}
                variant="primary"
                className="w-full gap-2"
            >
                <Plus className="h-4 w-4" />
                Add Routine Item
            </Button>

            {/* Add / Edit Dialog */}
            <Dialog
                isOpen={isDialogOpen}
                onClose={() => { setIsDialogOpen(false); setEditingItem(null); }}
                title={editingItem ? 'Edit Routine Item' : 'Add Routine Item'}
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => { setIsDialogOpen(false); setEditingItem(null); }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => handleAddRoutine()}
                            className="flex-1"
                        >
                            {editingItem ? 'Save' : 'Add'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleAddRoutine} className="space-y-4">
                    <Input
                        label="Routine Item"
                        placeholder="e.g., Morning run, Cold shower"
                        value={formData.item_name}
                        onChange={e => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
                    />
                    <Input
                        label="Notes (optional)"
                        placeholder="Any details..."
                        value={formData.notes}
                        onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                </form>
            </Dialog>
        </div>
    );
}
