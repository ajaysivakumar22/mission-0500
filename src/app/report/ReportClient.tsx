'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { createReport } from '@/server/actions/reports';
import { RadarTelemetry } from '@/components/ui/RadarTelemetry';
import { Save, Crosshair, AlertTriangle, ShieldCheck } from 'lucide-react';
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

    // Dynamic telemetry calculations for the radar chart based on input lengths
    const executionScore = Math.min(10, Math.ceil(formData.accomplishments.length / 20) || 1);
    const resilienceScore = Math.min(10, Math.ceil(formData.failures.length / 20) || 1);
    const adaptabilityScore = Math.min(10, Math.ceil(formData.lessons_learned.length / 20) || 1);

    const radarData = [
        { subject: 'DISCIPLINE', A: formData.discipline_score, fullMark: 10 },
        { subject: 'ENERGY', A: formData.energy_score, fullMark: 10 },
        { subject: 'EXECUTION', A: executionScore, fullMark: 10 },
        { subject: 'RESILIENCE', A: resilienceScore, fullMark: 10 },
        { subject: 'ADAPTATION', A: adaptabilityScore, fullMark: 10 },
    ];

    return (
        <MainLayout>
            <div className="w-full space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    title="After Action Report (AAR)"
                    subtitle="Analyze tactical execution. Embrace failure as a stepping stone to mastery."
                />

                <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

                    {/* AAR Form Section */}
                    <div className="rounded-2xl border border-white/10 bg-[#162B20]/80 p-8 backdrop-blur-md shadow-lg order-2 lg:order-1">
                        <div className="mb-8 flex items-center gap-3 border-b border-[#1E3A2A] pb-4">
                            <ShieldCheck className="h-6 w-6 text-[#FFD60A]" />
                            <h2 className="text-xl font-black uppercase tracking-widest text-[#E8E8E8]">Debriefing Protocol</h2>
                        </div>

                        <form onSubmit={handleSaveReport} className="space-y-6">
                            {/* Accomplishments */}
                            <Textarea
                                label="Sustains (What went right?)"
                                placeholder="Identify tactics that succeeded. Log achievements..."
                                value={formData.accomplishments}
                                onChange={e =>
                                    setFormData(prev => ({ ...prev, accomplishments: e.target.value }))
                                }
                                rows={4}
                            />

                            {/* Failures */}
                            <Textarea
                                label="Improves (What went wrong?)"
                                placeholder="Acknowledge failures. Where did discipline break down?..."
                                value={formData.failures}
                                onChange={e => setFormData(prev => ({ ...prev, failures: e.target.value }))}
                                rows={4}
                            />

                            {/* Lessons */}
                            <Textarea
                                label="Adaptations (Directives for tomorrow)"
                                placeholder="Specify actionable changes to protocol for the next cycle..."
                                value={formData.lessons_learned}
                                onChange={e =>
                                    setFormData(prev => ({ ...prev, lessons_learned: e.target.value }))
                                }
                                rows={4}
                            />

                            {/* Scores */}
                            <div className="grid gap-6 md:grid-cols-2 mt-8 rounded-xl bg-[#0B1D13] p-6 border border-[#1E3A2A]">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#E8E8E8] mb-4">
                                        <Crosshair className="h-4 w-4 text-[#FFD60A]" />
                                        Discipline Level
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
                                        className="w-full accent-[#FFD60A]"
                                    />
                                    <p className="mt-2 text-right text-2xl font-black text-[#FFD60A]">
                                        {formData.discipline_score}<span className="text-sm text-[#6B7280]">/10</span>
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#E8E8E8] mb-4">
                                        <AlertTriangle className="h-4 w-4 text-[#FFD60A]" />
                                        Energy Reserves
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={formData.energy_score}
                                        onChange={e =>
                                            setFormData(prev => ({ ...prev, energy_score: parseInt(e.target.value) }))
                                        }
                                        className="w-full accent-[#FFD60A]"
                                    />
                                    <p className="mt-2 text-right text-2xl font-black text-[#FFD60A]">
                                        {formData.energy_score}<span className="text-sm text-[#6B7280]">/10</span>
                                    </p>
                                </div>
                            </div>

                            {/* Save Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isSaving}
                                className="w-full gap-2 mt-8 py-6 text-lg tracking-widest font-black"
                            >
                                <Save className="h-5 w-5" />
                                FILE REPORT
                            </Button>
                        </form>
                    </div>

                    {/* Telemetry Section */}
                    <div className="space-y-6 order-1 lg:order-2">
                        <div className="rounded-2xl border border-white/10 bg-[#162B20]/80 p-6 backdrop-blur-md shadow-lg">
                            <h3 className="mb-2 text-center text-sm font-bold uppercase tracking-widest text-[#9CA3AF]">
                                Tactical Telemetry
                            </h3>
                            <RadarTelemetry data={radarData} />
                            <p className="mt-4 text-center text-xs text-[#6B7280] uppercase tracking-widest">
                                Live psychological signature based on AAR data inputs.
                            </p>
                        </div>

                        <InspirationalQuote
                            quote="A person grows up when he's able to overcome hardships. Protection is important, but there are some things that a person must learn on his own."
                            author="Jiraiya"
                            bgImageUrl="https://images.unsplash.com/photo-1497215968147-3bd0234a4282?q=80&w=2670&auto=format&fit=crop"
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
