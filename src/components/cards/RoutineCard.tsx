'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit2, RotateCcw } from 'lucide-react';
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
                title={item.is_completed ? "Click to mark incomplete" : "Click to mark complete"}
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

            {/* Clear Restore / Deselect Action Button for Completed Routine Items */}
            {item.is_completed && (
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={isUpdating || isLoading}
                    className="text-xs font-mono-tech uppercase font-bold text-accent hover:bg-accent/15 px-2.5 py-1 rounded-md border border-accent/30 flex items-center gap-1.5 transition-all shadow-xs flex-shrink-0"
                    title="Mark incomplete / Restore routine item"
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
                        onClick={() => onEdit(item)}
                        disabled={isUpdating}
                        className="h-8.5 w-8.5 p-0 text-textMuted hover:text-textMain hover:bg-surface-muted border border-transparent hover:border-border rounded-lg transition-all"
                        aria-label="Edit routine item"
                        title="Edit routine item"
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
                    aria-label="Delete routine item"
                    title="Delete routine item"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
}
