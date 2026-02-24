'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { createReport } from '@/server/actions/reports';
import { Save } from 'lucide-react';
import type { DailyReport } from '@/types';

interface ReportClientProps {
    userId: string;
    initialReport: DailyReport | null;
}

export default function ReportClient({ userId, initialReport }: ReportClientProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        accomplishments: initialReport?.accomplishments || '',
        failures: initialReport?.failures || '',
        lessons_learned: initialReport?.lessons_learned || '',
        discipline_score: initialReport?.discipline_score || 5,
        energy_score: initialReport?.energy_score || 5,
    });

    const handleSaveReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const today = new Date().toISOString().split('T')[0];
            const result = await createReport(userId, {
                report_date: today,
                ...formData,
            });

            if (result.success) {
                alert('Report saved successfully');
            } else {
                alert(result.error || 'Failed to save report');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    title="After Action Report"
                    subtitle="Analyze your performance. Embrace your failures as stepping stones to mastery."
                />

                <InspirationalQuote
                    quote="A person grows up when he's able to overcome hardships. Protection is important, but there are some things that a person must learn on his own."
                    author="Jiraiya"
                    bgImageUrl="https://images.unsplash.com/photo-1497215968147-3bd0234a4282?q=80&w=2670&auto=format&fit=crop"
                />

                <div className="rounded-2xl border border-white/10 bg-[#162B20]/80 p-8 backdrop-blur-md shadow-lg">
                    <p className="mb-8 text-[#9CA3AF] text-lg font-medium tracking-wide">
                        Reflect on your day and document your progress. Be brutally honest with yourself.
                    </p>

                    <form onSubmit={handleSaveReport} className="space-y-6">
                        {/* Accomplishments */}
                        <Textarea
                            label="What did I accomplish today?"
                            placeholder="List your achievements, big and small..."
                            value={formData.accomplishments}
                            onChange={e =>
                                setFormData(prev => ({ ...prev, accomplishments: e.target.value }))
                            }
                            rows={4}
                        />

                        {/* Failures */}
                        <Textarea
                            label="What didn't go as planned?"
                            placeholder="List setbacks or things you could improve..."
                            value={formData.failures}
                            onChange={e => setFormData(prev => ({ ...prev, failures: e.target.value }))}
                            rows={4}
                        />

                        {/* Lessons */}
                        <Textarea
                            label="What did I learn?"
                            placeholder="Key lessons and insights from today..."
                            value={formData.lessons_learned}
                            onChange={e =>
                                setFormData(prev => ({ ...prev, lessons_learned: e.target.value }))
                            }
                            rows={4}
                        />

                        {/* Scores */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-[#E8E8E8] mb-2">
                                    Discipline Score (1-10)
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={formData.discipline_score}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            discipline_score: parseInt(e.target.value),
                                        }))
                                    }
                                    className="w-full"
                                />
                                <p className="mt-2 text-center text-2xl font-bold text-[#FFD60A]">
                                    {formData.discipline_score}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#E8E8E8] mb-2">
                                    Energy Score (1-10)
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={formData.energy_score}
                                    onChange={e =>
                                        setFormData(prev => ({ ...prev, energy_score: parseInt(e.target.value) }))
                                    }
                                    className="w-full"
                                />
                                <p className="mt-2 text-center text-2xl font-bold text-[#FFD60A]">
                                    {formData.energy_score}
                                </p>
                            </div>
                        </div>

                        {/* Save Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSaving}
                            className="w-full gap-2"
                        >
                            <Save className="h-5 w-5" />
                            Save Report
                        </Button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
