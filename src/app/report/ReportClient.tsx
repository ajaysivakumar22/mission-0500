'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { createReport } from '@/server/actions/reports';
import { RadarTelemetry } from '@/components/ui/RadarTelemetry';
import { Save, Crosshair, AlertTriangle, ShieldCheck, History, Download, Lock } from 'lucide-react';
import type { DailyReport } from '@/types';

interface ReportClientProps {
    userId: string;
    initialReport: DailyReport | null;
    allReports: DailyReport[];
    isPremium: boolean;
}

export default function ReportClient({ userId, initialReport, allReports, isPremium }: ReportClientProps) {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
    const [historyFilter, setHistoryFilter] = useState<'week1' | 'week2' | 'week3' | 'week4' | 'month'>('week1');
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
                toast('Report saved successfully', 'success');
            } else {
                toast(result.error || 'Failed to save report', 'error');
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Dynamic telemetry calculations for the radar chart based on input lengths
    const executionScore = Math.min(10, Math.ceil(formData.accomplishments.length / 20) || 1);
    const resilienceScore = Math.min(10, Math.ceil(formData.failures.length / 20) || 1);
    const adaptabilityScore = Math.min(10, Math.ceil(formData.lessons_learned.length / 20) || 1);

    // Filter logic for historical reports
    const filteredReports = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        return allReports.filter(report => {
            const reportDate = new Date(report.report_date).getTime();
            if (reportDate < startOfMonth) return historyFilter === 'month'; // Only keep past months if Month view

            const dayOfMonth = new Date(report.report_date).getDate();
            if (historyFilter === 'week1') return dayOfMonth >= 1 && dayOfMonth <= 7;
            if (historyFilter === 'week2') return dayOfMonth >= 8 && dayOfMonth <= 14;
            if (historyFilter === 'week3') return dayOfMonth >= 15 && dayOfMonth <= 21;
            if (historyFilter === 'week4') return dayOfMonth >= 22;

            return true; // Month view shows everything
        });
    }, [allReports, historyFilter]);

    const handleDownloadCSV = () => {
        const headers = ['Date', 'Discipline', 'Energy', 'Accomplishments', 'Failures', 'Adaptations'];
        const rows = filteredReports.map(r => [
            r.report_date,
            r.discipline_score,
            r.energy_score,
            `"${r.accomplishments?.replace(/"/g, '""') || ''}"`,
            `"${r.failures?.replace(/"/g, '""') || ''}"`,
            `"${r.lessons_learned?.replace(/"/g, '""') || ''}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Mission_0500_AAR_${historyFilter}.csv`;
        link.click();
    };

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
                    <div className="rounded-2xl border border-border bg-surface/80 p-8 backdrop-blur-md shadow-lg order-2 lg:order-1 flex flex-col">

                        {/* Tabs */}
                        <div className="flex w-full mb-8 border-b border-border">
                            <button
                                onClick={() => setActiveTab('today')}
                                className={`flex items-center gap-2 px-6 py-4 font-bold uppercase tracking-widest transition-colors ${activeTab === 'today'
                                    ? 'border-b-2 border-accent text-accent'
                                    : 'text-textMuted hover:text-textMain'
                                    }`}
                            >
                                <ShieldCheck className="h-5 w-5" />
                                Today&apos;s Debrief
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex items-center gap-2 px-6 py-4 font-bold uppercase tracking-widest transition-colors ${activeTab === 'history'
                                    ? 'border-b-2 border-accent text-accent'
                                    : 'text-textMuted hover:text-textMain'
                                    }`}
                            >
                                <History className="h-5 w-5" />
                                Combat History
                            </button>
                        </div>

                        {activeTab === 'today' ? (
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
                        ) : (
                            <div className="flex flex-col flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* History Controls */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-4 rounded-xl border border-border">
                                    <div className="flex flex-wrap gap-2">
                                        {(['week1', 'week2', 'week3', 'week4'] as const).map(week => (
                                            <button
                                                key={week}
                                                onClick={() => setHistoryFilter(week)}
                                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${historyFilter === week ? 'bg-primary text-accent' : 'bg-surface text-textMuted hover:text-textMain'
                                                    }`}
                                            >
                                                {week}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => isPremium ? setHistoryFilter('month') : toast('Upgrade to Elite Protocol to view the 30-Day Monthly Progression.', 'warning')}
                                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors relative ${historyFilter === 'month' ? 'bg-primary text-accent' : 'bg-surface text-textMuted hover:text-textMain'
                                                }`}
                                        >
                                            30 Days
                                            {!isPremium && <Lock className="h-3 w-3 text-red-400" />}
                                        </button>
                                    </div>

                                    <Button
                                        onClick={handleDownloadCSV}
                                        variant="secondary"
                                        className="gap-2 text-xs h-9 py-0"
                                    >
                                        <Download className="h-4 w-4" />
                                        EXPORT CSV
                                    </Button>
                                </div>

                                {/* Premium Upsell if blocked */}
                                {!isPremium && historyFilter === 'month' && (
                                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-accent/20 rounded-xl bg-accent/5">
                                        <Lock className="h-12 w-12 text-accent mb-4" />
                                        <h3 className="text-lg font-black tracking-widest text-textMain uppercase mb-2">Elite Protocol Required</h3>
                                        <p className="text-sm text-textMuted max-w-md">
                                            The Monthly Progression Analytics and 30-Day CSV Exports are reserved for Elite Operators. Upgrade your clearance in Settings to access full historical telemetry.
                                        </p>
                                    </div>
                                )}

                                {/* Historical Data List */}
                                {(isPremium || historyFilter !== 'month') && (
                                    <div className="flex-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        {filteredReports.length === 0 ? (
                                            <div className="text-center py-12 text-textMuted font-bold uppercase tracking-widest text-sm">
                                                No AAR Data for this period.
                                            </div>
                                        ) : (
                                            filteredReports.map(report => (
                                                <div key={report.id} className="p-4 rounded-xl bg-background border border-border space-y-3">
                                                    <div className="flex justify-between items-center border-b border-border pb-2">
                                                        <span className="font-black text-accent tracking-widest">{report.report_date}</span>
                                                        <div className="flex gap-4 text-xs font-bold text-textMuted">
                                                            <span>Discipline: {report.discipline_score}/10</span>
                                                            <span>Energy: {report.energy_score}/10</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-textMain line-clamp-2"><span className="text-textMuted font-bold text-xs uppercase mr-2">Sustains:</span>{report.accomplishments || 'N/A'}</p>
                                                    <p className="text-sm text-textMain line-clamp-2"><span className="text-textMuted font-bold text-xs uppercase mr-2">Improves:</span>{report.failures || 'N/A'}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                            </div>
                        )}
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

                        <InspirationalQuote />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
