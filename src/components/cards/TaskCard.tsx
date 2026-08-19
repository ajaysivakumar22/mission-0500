'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit2 } from 'lucide-react';
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
        if (confirm('Delete this task?')) {
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
            className={`flex items-center gap-3 px-5 py-4 transition-colors duration-200 ${
                task.is_completed ? 'bg-surface-muted/40' : 'hover:bg-surface-muted/30'
            }`}
        >
            <Checkbox
                checked={task.is_completed}
                onChange={handleToggle}
                disabled={isUpdating || isLoading}
                className="flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-medium text-sm leading-snug transition-all duration-300 ${
                        task.is_completed ? 'line-through text-textMuted' : 'text-textMain'
                    }`}>
                        {task.title}
                    </p>
                    <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
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

            <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(task)}
                        disabled={isUpdating}
                        className="h-7 w-7 p-0 text-textMuted hover:text-textMain"
                        aria-label="Edit task"
                    >
                        <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isUpdating}
                    className="h-7 w-7 p-0 text-textMuted hover:text-danger"
                    aria-label="Delete task"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </motion.div>
    );
}
