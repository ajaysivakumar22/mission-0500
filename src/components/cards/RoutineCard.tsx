'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit2, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
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
        if (confirm('Delete this item?')) {
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
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`group relative flex items-center gap-4 rounded-2xl border p-4 shadow-sm backdrop-blur-xl transition-[border-color,background-color] duration-500 overflow-hidden ${item.is_completed
                    ? 'border-white/10 bg-[#162B20]/40'
                    : 'border-white/5 bg-black/40 hover:border-white/20 hover:bg-black/60'
                }`}
        >
            {/* Visual Feedback Completion Glow */}
            <div className={`absolute inset-0 bg-gradient-to-r from-[#FFD60A]/10 to-transparent transition-opacity duration-700 pointer-events-none ${item.is_completed ? 'opacity-100' : 'opacity-0'}`} />
            
            <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors">
                <GripVertical className="h-5 w-5" />
            </div>

            <Checkbox
                checked={item.is_completed}
                onChange={handleToggle}
                disabled={isUpdating || isLoading}
                className="flex-shrink-0"
            />

            <div className="flex-1 min-w-0 relative z-10 transition-all duration-300">
                <p
                    className={`font-medium tracking-wide ${item.is_completed
                        ? 'line-through text-white/40'
                        : 'text-white/90'
                        }`}
                >
                    {item.item_name}
                </p>
                {item.notes && (
                    <p className={`mt-1 text-sm ${item.is_completed ? 'text-white/20' : 'text-white/50'}`}>{item.notes}</p>
                )}
            </div>

            <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        disabled={isUpdating}
                        className="h-8 w-8 p-0"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isUpdating}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
}
