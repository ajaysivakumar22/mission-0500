'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit2, Archive } from 'lucide-react';
import { getCategoryLabel } from '@/lib/utils/formatters';
import type { Goal } from '@/types';

interface GoalCardProps {
    goal: Goal;
    onDelete: (id: string) => Promise<void>;
    onArchive: (id: string) => Promise<void>;
    onEdit?: (goal: Goal) => void;
    onClick?: () => void;
    isLoading?: boolean;
}

export function GoalCard({
    goal,
    onDelete,
    onArchive,
    onEdit,
    onClick,
    isLoading = false,
}: GoalCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDelete = async () => {
        if (confirm('Delete this goal?')) {
            setIsUpdating(true);
            try {
                await onDelete(goal.id);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleArchive = async () => {
        setIsUpdating(true);
        try {
            await onArchive(goal.id);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div
            onClick={onClick}
            className="cursor-pointer rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6 transition-all hover:border-[#1B4332]"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#E8E8E8]">{goal.title}</h3>
                        <span className="rounded-full bg-[#1B4332] px-2 py-1 text-xs font-semibold text-[#FFD60A]">
                            {getCategoryLabel(goal.category)}
                        </span>
                    </div>

                    {goal.description && (
                        <p className="mt-2 text-sm text-[#9CA3AF]">{goal.description}</p>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-[#6B7280]">Progress</span>
                            <span className="text-sm font-semibold text-[#FFD60A]">{goal.progress_percentage}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#0B1D13]">
                            <div
                                className="h-full bg-[#FFD60A] transition-all duration-300"
                                style={{ width: `${goal.progress_percentage}%` }}
                            />
                        </div>
                    </div>

                    {goal.target_date && (
                        <p className="mt-2 text-xs text-[#6B7280]">
                            Target: {new Date(goal.target_date).toLocaleDateString()}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                                e.stopPropagation();
                                onEdit(goal);
                            }}
                            disabled={isUpdating}
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                            e.stopPropagation();
                            handleArchive();
                        }}
                        disabled={isUpdating}
                    >
                        <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        disabled={isUpdating}
                        className="text-red-500 hover:text-red-400"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
