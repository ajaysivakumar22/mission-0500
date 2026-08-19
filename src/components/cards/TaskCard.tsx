'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit2, RotateCcw } from 'lucide-react';
import { getPriorityColor, getPriorityLabel } from '@/lib/utils/formatters';
import type { DailyTask } from '@/types';

interface TaskCardProps {
    task: DailyTask;
    onToggle: (id: string, completed: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEdit?: (task: DailyTask) => void;
    isLoading?: boolean;
}

export function TaskCard({
    task,
    onToggle,
    onDelete,
    onEdit,
    isLoading = false,
}: TaskCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggle = async () => {
        setIsUpdating(true);
        try {
            await onToggle(task.id, !task.is_completed);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Delete this task objective?')) {
            setIsUpdating(true);
            try {
                await onDelete(task.id);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const priorityColor = getPriorityColor(task.priority);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ layout: { type: 'spring', bounce: 0.15, duration: 0.5 } }}
            className={`flex items-center gap-3 px-5 py-4 group transition-colors duration-200 ${
                task.is_completed ? 'bg-surface-muted/40' : 'hover:bg-surface-muted/30'
            }`}
        >
            <Checkbox
                checked={task.is_completed}
                onChange={handleToggle}
                disabled={isUpdating || isLoading}
                className="flex-shrink-0"
                title={task.is_completed ? "Click to mark incomplete" : "Click to mark complete"}
            />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-medium text-sm leading-snug transition-all duration-300 ${
                        task.is_completed ? 'line-through text-textMuted' : 'text-textMain'
                    }`}>
                        {task.title}
                    </p>
                    <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono-tech font-bold uppercase tracking-wider"
                        style={{
                            backgroundColor: priorityColor + '18',
                            color: priorityColor,
                        }}
                    >
                        {getPriorityLabel(task.priority)}
                    </span>
                </div>
                {task.description && (
                    <p className="mt-0.5 text-xs text-textMuted leading-relaxed">{task.description}</p>
                )}
            </div>

            {/* Clear Restore / Deselect Action Button for Completed Items */}
            {task.is_completed && (
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={isUpdating || isLoading}
                    className="text-xs font-mono-tech uppercase font-bold text-accent hover:bg-accent/15 px-2.5 py-1 rounded-md border border-accent/30 flex items-center gap-1.5 transition-all shadow-xs flex-shrink-0"
                    title="Mark incomplete / Restore task"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Restore</span>
                </button>
            )}

            <div className="flex items-center gap-1.5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(task)}
                        disabled={isUpdating}
                        className="h-8.5 w-8.5 p-0 text-textMuted hover:text-textMain hover:bg-surface-muted border border-transparent hover:border-border rounded-lg transition-all"
                        aria-label="Edit task"
                        title="Edit task"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isUpdating}
                    className="h-8.5 w-8.5 p-0 text-textMuted hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all"
                    aria-label="Delete task objective"
                    title="Delete task objective"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
}
