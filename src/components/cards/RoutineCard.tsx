'use client';

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
        <div
            className={`flex items-center gap-4 rounded-xl border border-[#1E3A2A] bg-[#162B20] p-4 transition-all ${item.is_completed ? 'opacity-60' : ''
                }`}
        >
            <Checkbox
                checked={item.is_completed}
                onChange={handleToggle}
                disabled={isUpdating || isLoading}
                className="flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <p
                    className={`font-medium ${item.is_completed
                            ? 'line-through text-[#6B7280]'
                            : 'text-[#E8E8E8]'
                        }`}
                >
                    {item.item_name}
                </p>
                {item.notes && (
                    <p className="mt-1 text-sm text-[#9CA3AF]">{item.notes}</p>
                )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
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
