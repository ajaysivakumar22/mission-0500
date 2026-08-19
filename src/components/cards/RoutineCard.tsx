'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit2 } from 'lucide-react';
import type { DailyRoutine } from '@/types';

interface RoutineCardProps {
    item: DailyRoutine;
    onToggle: (id: string, completed: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEdit?: (item: DailyRoutine) => void;
    isLoading?: boolean;
}

export function RoutineCard({
    item,
    onToggle,
    onDelete,
    onEdit,
    isLoading = false,
}: RoutineCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggle = async () => {
        setIsUpdating(true);
        try {
            await onToggle(item.id, !item.is_completed);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Delete this routine item?')) {
            setIsUpdating(true);
            try {
                await onDelete(item.id);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ layout: { type: 'spring', bounce: 0.15, duration: 0.5 } }}
            className={`flex items-center gap-3 px-5 py-4 group transition-colors duration-200 ${
                item.is_completed ? 'bg-surface-muted/40' : 'hover:bg-surface-muted/30'
            }`}
        >
            <Checkbox
                checked={item.is_completed}
                onChange={handleToggle}
                disabled={isUpdating || isLoading}
                className="flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm leading-snug transition-all duration-300 ${
                    item.is_completed ? 'line-through text-textMuted' : 'text-textMain'
                }`}>
                    {item.item_name}
                </p>
                {item.notes && (
                    <p className="mt-0.5 text-xs text-textMuted">{item.notes}</p>
                )}
            </div>

            <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        disabled={isUpdating}
                        className="h-7 w-7 p-0 text-textMuted hover:text-textMain"
                        aria-label="Edit routine item"
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
                    aria-label="Delete routine item"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </motion.div>
    );
}
