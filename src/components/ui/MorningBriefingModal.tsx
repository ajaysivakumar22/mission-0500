'use client';

import { useState, useEffect } from 'react';
import { Target, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addTask } from '@/server/actions/tasks';

export function MorningBriefingModal({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [objective, setObjective] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only run on the client side
        const today = new Date().toISOString().split('T')[0];
        const briefedDate = localStorage.getItem('mission_0500_briefed_date');

        // Check if they haven't set their objective today
        if (briefedDate !== today) {
            setIsOpen(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!objective.trim()) {
            setError('An officer does not skip their main objective.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const today = new Date().toISOString().split('T')[0];

        // Add as a High Priority task
        const result = await addTask(userId, {
            task_date: today,
            title: `MAIN OBJECTIVE: ${objective}`,
            description: 'Declared during 0500 Morning Briefing',
            priority: 'high',
        });

        setIsLoading(false);

        if (result.success) {
            // Documenting that they completed the briefing today
            localStorage.setItem('mission_0500_briefed_date', today);
            setIsOpen(false);
        } else {
            setError(result.error || 'Failed to lock in objective. Try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
            <div className="w-full max-w-lg rounded-2xl border border-[#FFD60A]/30 bg-[#0B1D13] p-8 shadow-[0_0_60px_rgba(255,214,10,0.15)]">

                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#FFD60A] bg-[#162B20]/80">
                        <Target className="h-8 w-8 text-[#FFD60A] animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-wider text-[#E8E8E8]">0500 Morning Briefing</h2>
                    <p className="mt-2 text-sm font-medium tracking-wide text-[#9CA3AF]">
                        IDENTIFY YOUR PRIMARY TARGET. WHAT IS THE SINGLE MOST IMPORTANT MISSION FOR TODAY?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            placeholder="I will complete the..."
                            value={objective}
                            onChange={(e) => {
                                setObjective(e.target.value);
                                if (error) setError(null);
                            }}
                            className="text-lg py-6"
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 flex items-center gap-1 text-sm text-red-500 font-bold">
                                <AlertCircle className="h-4 w-4" /> {error}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#FFD60A] text-black hover:bg-[#FFD60A]/80 font-black tracking-widest text-lg py-6 shadow-[0_0_20px_rgba(255,214,10,0.3)] hover:shadow-[0_0_40px_rgba(255,214,10,0.5)] transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        {isLoading ? 'LOCKING TARGET...' : 'LOCK IN TARGET'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
