'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { TaskCard } from '@/components/cards/TaskCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { addTask, updateTask, deleteTask } from '@/server/actions/tasks';
import { Plus, Target, ShieldAlert, CheckCircle2, ListFilter } from 'lucide-react';
import type { DailyTask } from '@/types';

interface TasksClientProps {
    userId: string;
    initialTasks: DailyTask[];
}

export default function TasksClient({ userId, initialTasks }: TasksClientProps) {
    const { toast } = useToast();
    const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
    });

    const completedCount = tasks.filter(t => t.is_completed).length;
    const completionPercentage = tasks.length > 0
        ? Math.round((completedCount / tasks.length) * 100)
        : 0;

    const primaryTask = tasks.find(t => t.priority === 'high' && !t.is_completed) || tasks.find(t => !t.is_completed);
    const secondaryTasks = tasks.filter(t => t.id !== primaryTask?.id);

    const handleAddTask = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!formData.title.trim()) {
            toast('Please enter a task title', 'warning');
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        const result = await addTask(userId, {
            task_date: today,
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
        });
        if (result.success && result.data) {
            setTasks(prev => [...prev, result.data!]);
            setFormData({ title: '', description: '', priority: 'medium' });
            setIsDialogOpen(false);
            setEditingTask(null);
        } else {
            toast(result.error || 'Failed to add task', 'error');
        }
    };

    const handleToggleTask = async (id: string, completed: boolean) => {
        const result = await updateTask(userId, id, { is_completed: completed });
        if (result.success && result.data) {
            setTasks(prev => prev.map(t => (t.id === id ? result.data! : t)));
        }
    };

    const handleDeleteTask = async (id: string) => {
        const result = await deleteTask(userId, id);
        if (result.success) {
            setTasks(prev => prev.filter(t => t.id !== id));
        }
    };

    const openDialog = (task?: DailyTask) => {
        if (task) {
            setEditingTask(task);
            setFormData({ title: task.title, description: task.description || '', priority: task.priority });
        } else {
            setEditingTask(null);
            setFormData({ title: '', description: '', priority: 'medium' });
        }
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                    <span className="font-mono-tech text-[10px] font-bold text-accent uppercase tracking-widest block">
                        TACTICAL DISPATCH
                    </span>
                    <h1 className="text-2xl font-serif-quote font-bold text-textMain tracking-tight">
                        Execution Board
                    </h1>
                </div>
                <Button onClick={() => openDialog()} variant="primary" className="gap-2 text-xs py-2">
                    <Plus className="h-4 w-4" />
                    New Objective
                </Button>
            </div>

            <InspirationalQuote compact />

            {/* Execution Telemetry Overview */}
            <div className="card p-5 bg-gradient-to-r from-surface to-surface-muted border-l-4 border-l-accent">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <span className="font-mono-tech text-[10px] text-textMuted uppercase tracking-widest block">
                            DAILY DISPATCH TELEMETRY
                        </span>
                        <p className="text-sm font-bold text-textMain">
                            {completedCount} of {tasks.length} objectives completed
                        </p>
                    </div>
                    <span className="text-3xl font-black text-accent tabular-nums">{completionPercentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-muted overflow-hidden border border-border">
                    <motion.div
                        className="h-full bg-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Primary Objective Banner */}
            {primaryTask && (
                <div className="bg-[#20382B] text-[#F8F4EB] p-5 rounded-xl border border-white/10 shadow-lg relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-[#D6A52C]" />
                            <span className="font-mono-tech text-[10px] text-[#D6A52C] uppercase tracking-widest font-bold">
                                PRIMARY OBJECTIVE // HIGH PRIORITY
                            </span>
                        </div>
                        <span className="font-mono-tech text-[10px] bg-[#D6A52C] text-[#20382B] font-bold px-2 py-0.5 rounded">
                            +50 XP
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <div>
                            <h2 className="text-lg font-bold text-white">{primaryTask.title}</h2>
                            {primaryTask.description && (
                                <p className="text-xs text-white/70 mt-1">{primaryTask.description}</p>
                            )}
                        </div>

                        <Button
                            onClick={() => handleToggleTask(primaryTask.id, true)}
                            variant="primary"
                            className="bg-[#D6A52C] text-[#20382B] hover:bg-[#c49526] font-bold gap-2 text-xs py-2 px-4 self-start sm:self-auto"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Mark Accomplished
                        </Button>
                    </div>
                </div>
            )}

            {/* Secondary Objectives List */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 border-l-4 border-l-[#58718A] pl-3 py-0.5">
                    <ListFilter className="h-4 w-4 text-[#58718A]" />
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                        Secondary Directives ({secondaryTasks.length})
                    </h2>
                </div>

                <div className="card overflow-hidden">
                    <motion.div layout className="divide-y divide-border">
                        <AnimatePresence mode="popLayout">
                            {secondaryTasks.length === 0 && !primaryTask ? (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="py-14 text-center space-y-2"
                                >
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-textMuted">
                                        <Target className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-textMain text-sm">No Active Directives</h3>
                                    <p className="text-xs text-textMuted max-w-xs mx-auto">
                                        Leave nothing to chance. Declare your daily execution objectives.
                                    </p>
                                </motion.div>
                            ) : (
                                secondaryTasks
                                    .sort((a, b) => Number(a.is_completed) - Number(b.is_completed))
                                    .map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onToggle={handleToggleTask}
                                            onDelete={handleDeleteTask}
                                            onEdit={openDialog}
                                        />
                                    ))
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Create Task Dialog */}
            <Dialog
                isOpen={isDialogOpen}
                onClose={() => { setIsDialogOpen(false); setEditingTask(null); }}
                title={editingTask ? 'Edit Objective' : 'Declare New Objective'}
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => { setIsDialogOpen(false); setEditingTask(null); }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => handleAddTask()}
                            className="flex-1"
                        >
                            {editingTask ? 'Save' : 'Lock In Objective'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleAddTask} className="space-y-4">
                    <Input
                        label="Objective Title"
                        placeholder="e.g., Complete architecture specification"
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                        label="Description (optional)"
                        placeholder="Define success parameters..."
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                    />
                    <Select
                        label="Priority Level"
                        value={formData.priority}
                        onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                        options={[
                            { value: 'low', label: 'Low — Secondary Task' },
                            { value: 'medium', label: 'Medium — Standard Task' },
                            { value: 'high', label: 'High — Primary Objective' },
                        ]}
                    />
                </form>
            </Dialog>
        </div>
    );
}
