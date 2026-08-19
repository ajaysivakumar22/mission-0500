'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { createReport } from '@/server/actions/reports';
import { RadarTelemetry } from '@/components/ui/RadarTelemetry';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { Save, History, Download, Lock, BarChart2, ClipboardCheck, BookOpen, Shield, Flame } from 'lucide-react';
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
            const result = await createReport(userId, { report_date: today, ...formData });
            if (result.success) {
                toast('After-Action Review logged successfully', 'success');
            } else {
                toast(result.error || 'Failed to save report', 'error');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const executionScore = Math.min(10, Math.ceil(formData.accomplishments.length / 20) || 1);
    const resilienceScore = Math.min(10, Math.ceil(formData.failures.length / 20) || 1);
    const adaptabilityScore = Math.min(10, Math.ceil(formData.lessons_learned.length / 20) || 1);

    const filteredReports = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        return allReports.filter(report => {
            const reportDate = new Date(report.report_date).getTime();
            if (reportDate < startOfMonth) return historyFilter === 'month';
            const dayOfMonth = new Date(report.report_date).getDate();
            if (historyFilter === 'week1') return dayOfMonth >= 1 && dayOfMonth <= 7;
            if (historyFilter === 'week2') return dayOfMonth >= 8 && dayOfMonth <= 14;
            if (historyFilter === 'week3') return dayOfMonth >= 15 && dayOfMonth <= 21;
            if (historyFilter === 'week4') return dayOfMonth >= 22;
            return true;
        });
    }, [allReports, historyFilter]);

    const handleDownloadCSV = () => {
        const headers = ['Date', 'Discipline', 'Energy', 'Accomplishments', 'Failures', 'Adaptations'];
        const rows = filteredReports.map(r => [
            r.report_date, r.discipline_score, r.energy_score,
            `"${r.accomplishments?.replace(/"/g, '""') || ''}"`,
            `"${r.failures?.replace(/"/g, '""') || ''}"`,
            `"${r.lessons_learned?.replace(/"/g, '""') || ''}"`,
        ]);
        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Mission_0500_AAR_Report_${historyFilter}.csv`;
        link.click();
    };

    const radarData = [
        { subject: 'Discipline', A: formData.discipline_score, fullMark: 10 },
        { subject: 'Energy', A: formData.energy_score, fullMark: 10 },
        { subject: 'Execution', A: executionScore, fullMark: 10 },
        { subject: 'Resilience', A: resilienceScore, fullMark: 10 },
        { subject: 'Adaptation', A: adaptabilityScore, fullMark: 10 },
    ];

    const todayDateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="space-y-8 animate-slide-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-tech text-xs font-bold text-accent uppercase tracking-widest">
                            AFTER-ACTION REVIEW (AAR)
                        </span>
                        <span className="bg-surface-dark text-[#F8F4EB] text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded">
                            {todayDateFormatted}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif-quote font-bold text-textMain tracking-tight">
                        Daily Debrief &amp; Telemetry
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('today')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                            activeTab === 'today'
                                ? 'bg-surface text-textMain shadow-sm border border-border'
                                : 'text-textMuted hover:text-textMain'
                        }`}
                    >
                        <ClipboardCheck className="h-3.5 w-3.5 inline mr-1.5" />
                        Today&apos;s Debrief
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                            activeTab === 'history'
                                ? 'bg-surface text-textMain shadow-sm border border-border'
                                : 'text-textMuted hover:text-textMain'
                        }`}
                    >
                        <History className="h-3.5 w-3.5 inline mr-1.5" />
                        Mission History
                    </button>
                </div>
            </div>

            <InspirationalQuote compact />

            {activeTab === 'today' ? (
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Left: Field Journal Debrief Form (2 Cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card p-6 space-y-5">
                            <div className="flex items-center gap-2 pb-3 border-b border-border">
                                <BookOpen className="h-5 w-5 text-accent" />
                                <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                                    Field Journal Reflection
                                </h2>
                            </div>

                            <form onSubmit={handleSaveReport} className="space-y-5">
                                {/* Field 1: What went right? */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-textMain uppercase tracking-wide flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#71866B]" />
                                        What went right today? (Sustains &amp; Wins)
                                    </label>
                                    <Textarea
                                        placeholder="Record key wins, focus triggers, tactics that succeeded..."
                                        value={formData.accomplishments}
                                        onChange={e => setFormData(prev => ({ ...prev, accomplishments: e.target.value }))}
                                        rows={3}
                                    />
                                </div>

                                {/* Field 2: What went wrong? */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-textMain uppercase tracking-wide flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#B85C3D]" />
                                        What went wrong? (Friction &amp; Breakdown)
                                    </label>
                                    <Textarea
                                        placeholder="Identify distractions, missed habits, loss of discipline..."
                                        value={formData.failures}
                                        onChange={e => setFormData(prev => ({ ...prev, failures: e.target.value }))}
                                        rows={3}
                                    />
                                </div>

                                {/* Field 3: Adaptations */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-textMain uppercase tracking-wide flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#58718A]" />
                                        Tomorrow&apos;s Adaptations (Tactical Adjustment)
                                    </label>
                                    <Textarea
                                        placeholder="Specific changes you will implement tomorrow..."
                                        value={formData.lessons_learned}
                                        onChange={e => setFormData(prev => ({ ...prev, lessons_learned: e.target.value }))}
                                        rows={3}
                                    />
                                </div>

                                {/* Semantic Score Sliders */}
                                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                                    {/* Discipline Score — Sage #71866B */}
                                    <div className="card-muted p-4 rounded-xl border-l-4 border-l-[#71866B]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-mono-tech font-bold text-[#71866B] uppercase tracking-wider">
                                                Discipline Rating
                                            </span>
                                            <span className="text-lg font-black text-textMain tabular-nums">
                                                {formData.discipline_score}<span className="text-xs text-textMuted font-normal">/10</span>
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1" max="10"
                                            value={formData.discipline_score}
                                            onChange={e => setFormData(prev => ({ ...prev, discipline_score: parseInt(e.target.value) }))}
                                            className="w-full accent-[#71866B]"
                                        />
                                    </div>

                                    {/* Energy Score — Saffron #D6A52C */}
                                    <div className="card-muted p-4 rounded-xl border-l-4 border-l-[#D6A52C]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-mono-tech font-bold text-[#D6A52C] uppercase tracking-wider">
                                                Energy &amp; Focus
                                            </span>
                                            <span className="text-lg font-black text-textMain tabular-nums">
                                                {formData.energy_score}<span className="text-xs text-textMuted font-normal">/10</span>
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1" max="10"
                                            value={formData.energy_score}
                                            onChange={e => setFormData(prev => ({ ...prev, energy_score: parseInt(e.target.value) }))}
                                            className="w-full accent-[#D6A52C]"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={isSaving}
                                    className="w-full gap-2 py-3"
                                >
                                    <Save className="h-4 w-4" />
                                    Log After-Action Review
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Performance Signature & Radar Telemetry (1 Col) */}
                    <div className="space-y-6">
                        <div className="card p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-mono-tech text-xs font-bold text-textMuted uppercase tracking-widest flex items-center gap-1.5">
                                    <BarChart2 className="h-4 w-4 text-accent" />
                                    Performance Signature
                                </span>
                            </div>

                            <RadarTelemetry data={radarData} />

                            <div className="space-y-2 pt-2 border-t border-border text-[11px] font-mono-tech">
                                <div className="flex justify-between">
                                    <span className="text-textMuted">Execution Index:</span>
                                    <span className="font-bold text-[#58718A]">{executionScore}/10</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-textMuted">Resilience Score:</span>
                                    <span className="font-bold text-[#B85C3D]">{resilienceScore}/10</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-textMuted">Adaptation Level:</span>
                                    <span className="font-bold text-[#71866B]">{adaptabilityScore}/10</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                /* Mission History View */
                <div className="card p-6 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                        <div className="flex flex-wrap gap-2">
                            {(['week1', 'week2', 'week3', 'week4'] as const).map(week => (
                                <button
                                    key={week}
                                    onClick={() => setHistoryFilter(week)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors uppercase tracking-wider ${
                                        historyFilter === week
                                            ? 'bg-accent-muted text-accent border border-accent/30'
                                            : 'bg-surface-muted text-textMuted hover:text-textMain'
                                    }`}
                                >
                                    {week.replace('week', 'Week ')}
                                </button>
                            ))}
                            <button
                                onClick={() => isPremium
                                    ? setHistoryFilter('month')
                                    : toast('Upgrade to Elite Protocol for 30-Day view', 'warning')}
                                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors uppercase tracking-wider ${
                                    historyFilter === 'month'
                                        ? 'bg-accent-muted text-accent border border-accent/30'
                                        : 'bg-surface-muted text-textMuted hover:text-textMain'
                                }`}
                            >
                                30 Days
                                {!isPremium && <Lock className="h-3 w-3" />}
                            </button>
                        </div>

                        <Button
                            onClick={handleDownloadCSV}
                            variant="ghost"
                            className="gap-1.5 text-xs h-8"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Export CSV
                        </Button>
                    </div>

                    {!isPremium && historyFilter === 'month' && (
                        <div className="py-10 text-center card-muted border-l-4 border-l-accent">
                            <Lock className="h-8 w-8 text-accent mx-auto mb-2" />
                            <h3 className="font-bold text-textMain mb-1">Elite Clearance Required</h3>
                            <p className="text-xs text-textMuted max-w-sm mx-auto">
                                30-day historical AAR debrief telemetry is available to Elite operators.
                            </p>
                        </div>
                    )}

                    {(isPremium || historyFilter !== 'month') && (
                        <div className="space-y-3">
                            {filteredReports.length === 0 ? (
                                <div className="py-12 text-center text-xs text-textMuted space-y-1">
                                    <History className="h-6 w-6 text-textMuted mx-auto opacity-50 mb-2" />
                                    <p className="font-bold text-textMain">No Reports Logged for this Period</p>
                                    <p>Complete your daily debrief to log performance telemetry.</p>
                                </div>
                            ) : (
                                filteredReports.map(report => (
                                    <div key={report.id} className="card-muted p-4 space-y-2 border-l-2 border-l-accent">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono-tech font-bold text-accent">{report.report_date}</span>
                                            <div className="flex gap-4 text-xs font-mono-tech text-textMuted">
                                                <span>Discipline: <strong className="text-textMain">{report.discipline_score}/10</strong></span>
                                                <span>Energy: <strong className="text-textMain">{report.energy_score}/10</strong></span>
                                            </div>
                                        </div>
                                        {report.accomplishments && (
                                            <p className="text-xs text-textSecondary">
                                                <span className="font-mono-tech text-[#71866B] font-bold mr-1.5 uppercase">Wins:</span>
                                                {report.accomplishments}
                                            </p>
                                        )}
                                        {report.failures && (
                                            <p className="text-xs text-textSecondary">
                                                <span className="font-mono-tech text-[#B85C3D] font-bold mr-1.5 uppercase">Friction:</span>
                                                {report.failures}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
