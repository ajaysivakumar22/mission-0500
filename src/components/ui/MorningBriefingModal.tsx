'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addTask } from '@/server/actions/tasks';
import { signOut } from '@/server/actions/auth';

interface MorningBriefingWidgetProps {
    userId: string;
    hasTodayObjective?: boolean;
}

/**
 * MorningBriefingWidget — replaces the old fullscreen blocking modal.
 * Renders as an inline card at the top of the dashboard ONLY when no
 * morning objective has been set today. Once set, it disappears cleanly.
 */
export function MorningBriefingModal({ userId, hasTodayObjective }: MorningBriefingWidgetProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [objective, setObjective] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (hasTodayObjective) {
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('mission_0500_briefed_date', today);
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const briefedDate = localStorage.getItem('mission_0500_briefed_date');

        if (briefedDate !== today) {
            setIsVisible(true);
        }
    }, [hasTodayObjective]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!objective.trim()) {
            setError('What is the one thing you must complete today?');
            return;
        }

        setIsLoading(true);
        setError(null);

        const today = new Date().toISOString().split('T')[0];
        const result = await addTask(userId, {
            task_date: today,
            title: `MAIN OBJECTIVE: ${objective}`,
            description: 'Declared during 0500 Morning Briefing',
            priority: 'high',
        });

        setIsLoading(false);

        if (result.success) {
            localStorage.setItem('mission_0500_briefed_date', today);
            setIsDone(true);
            setTimeout(() => setIsVisible(false), 1500);
        } else {
            if (result.error?.includes('foreign key constraint')) {
                setError('Session conflict. Please sign out and log back in.');
            } else {
                setError(result.error || 'Something went wrong. Try again.');
            }
        }
    };

    const handleSignOut = async () => {
        setIsLoading(true);
        await signOut();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="card p-6 border-l-4 border-l-accent"
                >
                    <AnimatePresence mode="wait">
                        {isDone ? (
                            <motion.div
                                key="done"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-3 py-2"
                            >
                                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                                <p className="font-semibold text-textMain">Objective locked in. Let&apos;s go.</p>
                            </motion.div>
                        ) : (
                            <motion.div key="form">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="mt-0.5 flex-shrink-0">
                                        <Target className="h-5 w-5 text-accent" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-textMain mb-0.5">Morning Briefing</h2>
                                        <p className="text-sm text-textSecondary">
                                            What is the one thing you must complete today?
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div>
                                        <Input
                                            placeholder="I will complete..."
                                            value={objective}
                                            onChange={e => {
                                                setObjective(e.target.value);
                                                if (error) setError(null);
                                            }}
                                            autoFocus
                                            className="text-base"
                                        />
                                        {error && (
                                            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
                                                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={isLoading}
                                            className="flex-1 sm:flex-none"
                                        >
                                            {isLoading ? 'Setting...' : 'Set Objective'}
                                        </Button>

                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            disabled={isLoading}
                                            className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-danger transition-colors"
                                        >
                                            <LogOut className="h-3 w-3" />
                                            Sign out
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
