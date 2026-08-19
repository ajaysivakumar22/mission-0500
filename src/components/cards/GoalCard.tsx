'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit2, Archive, ChevronRight } from 'lucide-react';
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

    const progress = goal.progress_percentage ?? 0;

    return (
        <div
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
            className="card p-5 group cursor-pointer hover:shadow-elevated transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-textMain leading-snug">{goal.title}</h3>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-accent-muted text-accent">
                            {getCategoryLabel(goal.category)}
                        </span>
                    </div>
                    {goal.description && (
                        <p className="text-sm text-textSecondary leading-relaxed">{goal.description}</p>
                    )}
                </div>

                {onClick && (
                    <ChevronRight className="h-4 w-4 text-textMuted flex-shrink-0 mt-0.5 group-hover:text-accent transition-colors" />
                )}
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-textMuted">Progress</span>
                    <span className="text-xs font-semibold text-accent tabular-nums">{progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                    <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                {goal.target_date && (
                    <p className="text-xs text-textMuted">
                        Due {new Date(goal.target_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                )}
                <div className="flex gap-1 ml-auto">
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => { e.stopPropagation(); onEdit(goal); }}
                            disabled={isUpdating}
                            className="h-7 w-7 p-0 text-textMuted hover:text-textMain"
                            aria-label="Edit goal"
                        >
                            <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => { e.stopPropagation(); handleArchive(); }}
                        disabled={isUpdating}
                        className="h-7 w-7 p-0 text-textMuted hover:text-textMain"
                        aria-label="Archive goal"
                    >
                        <Archive className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => { e.stopPropagation(); handleDelete(); }}
                        disabled={isUpdating}
                        className="h-7 w-7 p-0 text-textMuted hover:text-danger"
                        aria-label="Delete goal"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
