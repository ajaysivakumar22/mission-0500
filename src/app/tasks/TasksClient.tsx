'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TaskCard } from '@/components/cards/TaskCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/ui/Dialog';
import { addTask, updateTask, deleteTask } from '@/server/actions/tasks';
import { Plus } from 'lucide-react';
import type { DailyTask } from '@/types';

interface TasksClientProps {
    userId: string;
    initialTasks: DailyTask[];
}

export default function TasksClient({ userId, initialTasks }: TasksClientProps) {
    const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as const,
    });

    const completedCount = tasks.filter(t => t.is_completed).length;
    const completionPercentage = tasks.length > 0
        ? Math.round((completedCount / tasks.length) * 100)
        : 0;

    const handleAddTask = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!formData.title.trim()) {
            alert('Please enter a task title');
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
        } else {
            alert(result.error || 'Failed to add task');
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

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Completion Status */}
                <div className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#E8E8E8]">Today&apos;s Tasks</h2>
                        <span className="text-3xl font-bold text-[#FFD60A]">{completionPercentage}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-[#0B1D13] overflow-hidden">
                        <div
                            className="h-full bg-[#FFD60A] transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    <p className="mt-2 text-sm text-[#9CA3AF]">
                        {completedCount} of {tasks.length} completed
                    </p>
                </div>

                {/* Task Items */}
                <div className="space-y-3">
                    {tasks.length === 0 ? (
                        <p className="text-center text-[#9CA3AF]">No tasks for today</p>
                    ) : (
                        tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
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
                    Add Task
                </Button>

                {/* Add Dialog */}
                <Dialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="Add New Task"
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
                                onClick={() => handleAddTask()}
                                className="flex-1"
                            >
                                Add
                            </Button>
                        </>
                    }
                >
                    <form onSubmit={handleAddTask} className="space-y-4">
                        <Input
                            label="Task Title"
                            placeholder="e.g., Complete project"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <Textarea
                            label="Description (optional)"
                            placeholder="Add task details..."
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                        />
                        <Select
                            label="Priority"
                            value={formData.priority}
                            onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                            options={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' },
                            ]}
                        />
                    </form>
                </Dialog>
            </div>
        </MainLayout>
    );
}
