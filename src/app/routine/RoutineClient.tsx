'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
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
    initializeRoutineFromTemplate,
} from '@/server/actions/routine';
import { Plus, RotateCcw, Utensils, Zap, Shield, BookOpen, Dumbbell, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DailyRoutine } from '@/types';
import type { ArchetypeKey } from '@/lib/constants/xp-config';

interface RoutineClientProps {
    userId: string;
    initialRoutines: DailyRoutine[];
}

export default function RoutineClient({ userId, initialRoutines }: RoutineClientProps) {
    const { toast } = useToast();
    const [routines, setRoutines] = useState<DailyRoutine[]>(initialRoutines);
    
    // Add Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogCategory, setDialogCategory] = useState<'routine' | 'food_log'>('routine');
    const [showFoodConfirmation, setShowFoodConfirmation] = useState(false);
    const [formData, setFormData] = useState({
        item_name: '',
        notes: '',
    });

    // Templates Dialog State
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
    const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

    // Derived State
    const standardRoutines = routines.filter(r => r.category === 'routine');
    const foodLogs = routines.filter(r => r.category === 'food_log');

    const standardCompletedCount = standardRoutines.filter(r => r.is_completed).length;
    const foodLogsCompletedCount = foodLogs.filter(r => r.is_completed).length;

    const standardCompletionPercentage = standardRoutines.length > 0
        ? Math.round((standardCompletedCount / standardRoutines.length) * 100)
        : 0;

    const handleOpenAddDialog = (category: 'routine' | 'food_log') => {
        setDialogCategory(category);
        setShowFoodConfirmation(false);
        setFormData({ item_name: '', notes: '' });
        setIsDialogOpen(true);
    };

    const handleAddSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!formData.item_name.trim()) {
            toast('Please enter an item name', 'warning');
            return;
        }

        // Show confirmation for food logs
        if (dialogCategory === 'food_log' && !showFoodConfirmation) {
            setShowFoodConfirmation(true);
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const result = await addRoutineItem(userId, {
            routine_date: today,
            item_name: formData.item_name,
            notes: formData.notes,
            category: dialogCategory,
        });

        if (result.success && result.data) {
            setRoutines(prev => [...prev, result.data!]);
            setIsDialogOpen(false);
            toast(`Added to ${dialogCategory === 'food_log' ? 'Food Log' : 'Routine'}`, 'success');
        } else {
            toast(result.error || 'Failed to add item', 'error');
        }
    };

    const handleToggleItem = async (id: string, completed: boolean) => {
        const result = await updateRoutineItem(userId, id, { is_completed: completed });
        if (result.success && result.data) {
            setRoutines(prev => prev.map(r => (r.id === id ? result.data! : r)));
        }
    };

    const handleDeleteItem = async (id: string) => {
        const result = await deleteRoutineItem(userId, id);
        if (result.success) {
            setRoutines(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleApplyTemplate = async (archetype: ArchetypeKey) => {
        if (confirm('This will replace your current routine for today. Are you sure?')) {
            setIsApplyingTemplate(true);
            const result = await initializeRoutineFromTemplate(userId, archetype);
            if (result.success) {
                // Refresh the page to get the newly populated routines
                window.location.reload();
            } else {
                toast(result.error || 'Failed to apply template', 'error');
                setIsApplyingTemplate(false);
            }
        }
    };

    return (
        <MainLayout>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <PageHeader
                        title="Daily Routine & Nutrition"
                        subtitle="Discipline equals freedom. Track your actions and your fuel."
                    />
                    <Button 
                        variant="secondary" 
                        onClick={() => setIsTemplatesOpen(true)}
                        className="bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-md"
                    >
                        <Zap className="mr-2 h-4 w-4 text-[#FFD60A]" />
                        Templates
                    </Button>
                </div>

                <InspirationalQuote />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Routine Section */}
                    <motion.div 
                        layout
                        className="flex flex-col gap-6"
                    >
                        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#162B20]/40 to-black/40 p-6 backdrop-blur-2xl shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#FFD60A]/10 rounded-xl">
                                        <RotateCcw className="h-6 w-6 text-[#FFD60A]" />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-wider text-white">Daily Routine</h2>
                                </div>
                                <span className="text-3xl font-black text-[#FFD60A] opacity-90 drop-shadow-lg">
                                    {standardCompletionPercentage}%
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-black/40 overflow-hidden backdrop-blur-sm border border-white/5">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#FFD60A]/80 to-[#FFD60A] shadow-[0_0_15px_rgba(255,214,10,0.4)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${standardCompletionPercentage}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {standardRoutines.map(routine => (
                                    <RoutineCard
                                        key={routine.id}
                                        item={routine}
                                        onToggle={handleToggleItem}
                                        onDelete={handleDeleteItem}
                                    />
                                ))}
                            </AnimatePresence>
                            
                            {standardRoutines.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm"
                                >
                                    <p className="text-sm text-white/50 font-medium">No routine set. Add custom items or load a template.</p>
                                </motion.div>
                            )}
                        </div>

                        <Button
                            onClick={() => handleOpenAddDialog('routine')}
                            variant="primary"
                            className="w-full gap-2 shadow-lg shadow-[#FFD60A]/10"
                        >
                            <Plus className="h-5 w-5" />
                            Add Routine Item
                        </Button>
                    </motion.div>

                    {/* Food Log Section */}
                    <motion.div 
                        layout
                        className="flex flex-col gap-6"
                    >
                        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#1E3A2A]/40 to-black/40 p-6 backdrop-blur-2xl shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#4ade80]/10 rounded-xl">
                                        <Utensils className="h-6 w-6 text-[#4ade80]" />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-wider text-white">Food Log</h2>
                                </div>
                                <span className="text-sm font-bold text-white/50 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                    {foodLogsCompletedCount} / {foodLogs.length} Checked
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {foodLogs.map(log => (
                                    <RoutineCard
                                        key={log.id}
                                        item={log}
                                        onToggle={handleToggleItem}
                                        onDelete={handleDeleteItem}
                                    />
                                ))}
                            </AnimatePresence>

                            {foodLogs.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm"
                                >
                                    <p className="text-sm text-white/50 font-medium">Record your daily macros and meal requirements.</p>
                                </motion.div>
                            )}
                        </div>

                        <Button
                            onClick={() => handleOpenAddDialog('food_log')}
                            className="w-full gap-2 bg-[#1b3224] hover:bg-[#254531] text-[#4ade80] border border-[#4ade80]/20"
                        >
                            <Plus className="h-5 w-5" />
                            Add Food Target
                        </Button>
                    </motion.div>
                </div>

                {/* Add Item Dialog */}
                <Dialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title={dialogCategory === 'food_log' ? 'Add Food Target' : 'Add Routine Item'}
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={() => handleAddSubmit()} className="flex-1">
                                {showFoodConfirmation ? 'Proceed' : 'Add'}
                            </Button>
                        </>
                    }
                >
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        {showFoodConfirmation ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-200/80 text-sm font-medium"
                            >
                                <p className="mb-2 font-bold text-yellow-500">Wait, are you sure about this?</p>
                                <p>You&apos;re adding a food target. Just like your routine, this item will become a regular daily expectation. Stay disciplined!</p>
                            </motion.div>
                        ) : (
                            <>
                                <Input
                                    label={dialogCategory === 'food_log' ? 'Food / Macro Target' : 'Routine Item'}
                                    placeholder={dialogCategory === 'food_log' ? 'e.g., Eat 200g Protein' : 'e.g., Morning run'}
                                    value={formData.item_name}
                                    onChange={e => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
                                />
                                <Input
                                    label="Notes (optional)"
                                    placeholder="Add any specific details..."
                                    value={formData.notes}
                                    onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                />
                            </>
                        )}
                    </form>
                </Dialog>

                {/* Templates Dialog */}
                <Dialog
                    isOpen={isTemplatesOpen}
                    onClose={() => setIsTemplatesOpen(false)}
                    title="Routine Templates"
                >
                    <div className="space-y-4 mt-4">
                        <p className="text-sm text-white/50 mb-6">Replace your current routine with a predefined military-grade template.</p>
                        
                        <div className="grid gap-4">
                            <Button 
                                onClick={() => handleApplyTemplate('operator')}
                                disabled={isApplyingTemplate}
                                className="w-full justify-start h-auto p-4 bg-white/5 border-white/10 hover:bg-white/10"
                            >
                                <Shield className="h-6 w-6 text-[#FFD60A] mr-4 flex-shrink-0" />
                                <div className="text-left">
                                    <div className="font-bold text-white">Operator</div>
                                    <div className="text-xs text-white/50 font-normal">Early wake-ups, PT, structured discipline.</div>
                                </div>
                            </Button>
                            <Button 
                                onClick={() => handleApplyTemplate('scholar')}
                                disabled={isApplyingTemplate}
                                className="w-full justify-start h-auto p-4 bg-white/5 border-white/10 hover:bg-white/10"
                            >
                                <BookOpen className="h-6 w-6 text-blue-400 mr-4 flex-shrink-0" />
                                <div className="text-left">
                                    <div className="font-bold text-white">Scholar</div>
                                    <div className="text-xs text-white/50 font-normal">Academic excellence, reading, deep study.</div>
                                </div>
                            </Button>
                            <Button 
                                onClick={() => handleApplyTemplate('builder')}
                                disabled={isApplyingTemplate}
                                className="w-full justify-start h-auto p-4 bg-white/5 border-white/10 hover:bg-white/10"
                            >
                                <Rocket className="h-6 w-6 text-purple-400 mr-4 flex-shrink-0" />
                                <div className="text-left">
                                    <div className="font-bold text-white">Builder</div>
                                    <div className="text-xs text-white/50 font-normal">Ship fast. Deep work, planning, execution.</div>
                                </div>
                            </Button>
                            <Button 
                                onClick={() => handleApplyTemplate('athlete')}
                                disabled={isApplyingTemplate}
                                className="w-full justify-start h-auto p-4 bg-white/5 border-white/10 hover:bg-white/10"
                            >
                                <Dumbbell className="h-6 w-6 text-orange-400 mr-4 flex-shrink-0" />
                                <div className="text-left">
                                    <div className="font-bold text-white">Athlete</div>
                                    <div className="text-xs text-white/50 font-normal">Peak physical performance, training, recovery.</div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </motion.div>
        </MainLayout>
    );
}
