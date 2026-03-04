'use client';

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

    return (
        <div
            className={`relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-500 overflow-hidden ${task.is_completed
                    ? 'border-[#FFD60A]/40 bg-[#162B20]/60 opacity-80 backdrop-blur-sm'
                    : 'border-[#1E3A2A] bg-[#162B20] hover:border-[#1E3A2A]/80 hover:shadow-lg hover:-translate-y-0.5'
                }`}
        >
            {/* Visual Feedback Completion Glow */}
            <div className={`absolute inset-0 bg-gradient-to-r from-[#FFD60A]/20 to-transparent transition-opacity duration-700 pointer-events-none ${task.is_completed ? 'opacity-100' : 'opacity-0'}`} />
            <Checkbox
                checked={task.is_completed}
                onChange={handleToggle}
                disabled={isUpdating || isLoading}
                className="flex-shrink-0"
            />

            <div className="flex-1 min-w-0 relative z-10 transition-transform duration-300">
                <div className="flex items-center gap-2">
                    <p
                        className={`font-medium ${task.is_completed
                            ? 'line-through text-[#6B7280]'
                            : 'text-[#E8E8E8]'
                            }`}
                    >
                        {task.title}
                    </p>
                    <span
                        className="rounded-full px-2 py-1 text-xs font-semibold"
                        style={{ backgroundColor: getPriorityColor(task.priority) + '20', color: getPriorityColor(task.priority) }}
                    >
                        {getPriorityLabel(task.priority)}
                    </span>
                </div>
                {task.description && (
                    <p className="mt-1 text-sm text-[#9CA3AF]">{task.description}</p>
                )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(task)}
                        disabled={isUpdating}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isUpdating}
                    className="text-red-500 hover:text-red-400"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
