'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { updateUserProfile, signOut } from '@/server/actions/auth';
import { updateUserSettings } from '@/server/actions/settings';
import { submitFeedback } from '@/server/actions/feedback';
import { useTheme } from '@/lib/context/ThemeContext';
import {
    LogOut, Save, ShieldAlert, Crown, Zap, BookOpen, User, Target,
    Activity, MessageSquare, FileText, Shield, Mail, Info, ExternalLink,
    Sliders, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { OperationalDate } from '@/components/ui/OperationalDate';

interface SettingsClientProps {
    userId: string;
    fullName: string;
    email: string;
    initialStrictMode: boolean;
    isPremium: boolean;
}

export default function SettingsClient({ userId, fullName, email, initialStrictMode, isPremium }: SettingsClientProps) {
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'config' | 'elite' | 'feedback'>('config');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'elite' || tab === 'feedback') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const [strictMode, setStrictMode] = useState(initialStrictMode);
    const [formData, setFormData] = useState({
        full_name: fullName,
        email: email,
    });
    const [feedback, setFeedback] = useState({ category: 'general', message: '' });
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingFeedback(true);
        setFeedbackStatus('idle');
        try {
            const res = await submitFeedback(feedback);
            if (res.success) {
                setFeedbackStatus('success');
                setFeedback({ category: 'general', message: '' });
                setTimeout(() => setFeedbackStatus('idle'), 3000);
            } else {
                setFeedbackStatus('error');
            }
        } catch {
            setFeedbackStatus('error');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const result = await updateUserProfile(userId, formData.full_name);
            const settingsResult = await updateUserSettings(userId, { strict_mode: strictMode });
            if (result.success && settingsResult.success) {
                toast('Profile updated successfully', 'success');
            } else {
                toast(result.error || settingsResult.error || 'Failed to update system', 'error');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-slide-in max-w-5xl mx-auto">
            {/* Header: Compact Editorial Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-3 gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <OperationalDate label="SYSTEM CONTROL" />
                    </div>
                    <h1 className="text-2xl font-serif-quote font-bold text-textMain tracking-tight mt-1">
                        Officer Configuration
                    </h1>
                </div>
                <div className="font-mono-tech text-xs text-textMuted">
                    <span>CLEARANCE: </span>
                    <span className={`font-bold ${isPremium ? 'text-accent' : 'text-textMain'}`}>
                        {isPremium ? 'ELITE PROTOCOL' : 'STANDARD OPERATOR'}
                    </span>
                </div>
            </div>

            <InspirationalQuote compact pageKey="settings" />

            {/* Command Navigation Rail */}
            <div className="bg-[#20382B] rounded-xl p-1.5 flex items-center gap-1 shadow-inner border border-white/10">
                <button
                    onClick={() => setActiveTab('config')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider transition-all ${
                        activeTab === 'config'
                            ? 'bg-[#E7E0D2] text-[#20382B] shadow-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Sliders className="h-3.5 w-3.5" />
                    Configuration
                </button>
                <button
                    onClick={() => setActiveTab('elite')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider transition-all ${
                        activeTab === 'elite'
                            ? 'bg-[#D6A52C] text-[#20382B] shadow-sm'
                            : 'text-[#D6A52C]/80 hover:text-[#D6A52C] hover:bg-white/5'
                    }`}
                >
                    <Crown className="h-3.5 w-3.5" />
                    Elite Status
                </button>
                <button
                    onClick={() => setActiveTab('feedback')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider transition-all ${
                        activeTab === 'feedback'
                            ? 'bg-[#E7E0D2] text-[#20382B] shadow-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Transmissions
                </button>
            </div>

            {/* CONFIGURATION TAB */}
            {activeTab === 'config' && (
                <div className="space-y-6">

                    {/* Section 1: Split Identity Profile */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                        <div className="bg-[#20382B] text-[#F8F4EB] p-5 rounded-xl border border-white/10 flex flex-col justify-between space-y-4">
                            <div>
                                <span className="font-mono-tech text-[10px] text-[#D6A52C] uppercase tracking-widest font-bold block mb-1">
                                    DOSSIER // 01
                                </span>
                                <h2 className="text-lg font-serif-quote font-bold text-white">Officer Identity</h2>
                                <p className="text-xs text-white/70 leading-relaxed mt-2">
                                    Your registered callsign and encryption credentials for Mission 0500 telemetry.
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/10 font-mono-tech text-[10px] text-white/60 space-y-1">
                                <div className="flex justify-between"><span>ACCOUNT ID:</span> <span className="text-white font-bold">{userId.slice(0, 8)}...</span></div>
                                <div className="flex justify-between"><span>STATUS:</span> <span className="text-[#D6A52C] font-bold">ACTIVE</span></div>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-[#F3EDE1] p-5 rounded-xl border border-border flex flex-col justify-between">
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Full Name / Callsign"
                                        value={formData.full_name}
                                        onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                    />
                                    <Input
                                        label="Registered Email"
                                        type="email"
                                        value={formData.email}
                                        disabled
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        isLoading={isSaving}
                                        className="gap-2 bg-[#20382B] text-white hover:bg-[#16271e] text-xs font-mono-tech uppercase"
                                    >
                                        <Save className="h-3.5 w-3.5 text-[#D6A52C]" />
                                        Save Callsign
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Section 2: Distinct Operating Profiles (4 Archetypes) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-l-4 border-l-[#20382B] pl-3 py-0.5">
                            <div>
                                <span className="font-mono-tech text-[10px] text-accent uppercase tracking-widest font-bold block">
                                    DOSSIER // 02
                                </span>
                                <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                                    Operating Profile Archetype
                                </h2>
                            </div>
                            <span className="font-mono-tech text-xs text-textMuted">Active: <strong className="text-textMain uppercase">{theme}</strong></span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                {
                                    id: 'operator',
                                    name: 'Operator',
                                    desc: 'Tactical discipline & morning routine execution.',
                                    accentColor: '#D6A52C',
                                    bgColor: 'bg-[#20382B]',
                                    textColor: 'text-white',
                                    badgeColor: 'bg-[#D6A52C] text-[#20382B]',
                                    icon: ShieldAlert,
                                },
                                {
                                    id: 'scholar',
                                    name: 'Scholar',
                                    desc: 'Deep work, study sprints & research focus.',
                                    accentColor: '#58718A',
                                    bgColor: 'bg-[#58718A]/10',
                                    textColor: 'text-textMain',
                                    badgeColor: 'bg-[#58718A] text-white',
                                    icon: BookOpen,
                                },
                                {
                                    id: 'athlete',
                                    name: 'Athlete',
                                    desc: 'Physical endurance & health tracking metrics.',
                                    accentColor: '#71866B',
                                    bgColor: 'bg-[#71866B]/10',
                                    textColor: 'text-textMain',
                                    badgeColor: 'bg-[#71866B] text-white',
                                    icon: Zap,
                                },
                                {
                                    id: 'protagonist',
                                    name: 'Protagonist',
                                    desc: 'High-stakes goal conquest & milestone strategy.',
                                    accentColor: '#B85C3D',
                                    bgColor: 'bg-[#B85C3D]/10',
                                    textColor: 'text-textMain',
                                    badgeColor: 'bg-[#B85C3D] text-white',
                                    icon: User,
                                }
                            ].map((item) => {
                                const Icon = item.icon;
                                const isSelected = theme === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setTheme(item.id as any)}
                                        className={`cursor-pointer rounded-xl p-4 transition-all border flex flex-col justify-between relative overflow-hidden ${
                                            isSelected
                                                ? 'border-2 shadow-md ring-2 ring-accent/30'
                                                : 'border-border hover:border-border-strong bg-surface'
                                        }`}
                                        style={{ borderColor: isSelected ? item.accentColor : undefined }}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`font-mono-tech text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.badgeColor}`}>
                                                    {item.name}
                                                </span>
                                                <Icon className="h-4 w-4" style={{ color: item.accentColor }} />
                                            </div>
                                            <p className="text-xs text-textSecondary leading-relaxed pt-1">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-[10px] font-mono-tech">
                                            <span className="text-textMuted">SELECT ARCHETYPE</span>
                                            {isSelected && <span className="font-bold text-accent">ACTIVE</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 3: High-Contrast Strict Accountability Panel */}
                    <div className="bg-[#20382B] text-[#F8F4EB] p-5 rounded-xl border border-white/10 shadow-lg relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1 max-w-xl">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-[#D6A52C]" />
                                    <span className="font-mono-tech text-[10px] text-[#D6A52C] uppercase tracking-widest font-bold">
                                        ACCOUNTABILITY PROTOCOL
                                    </span>
                                </div>
                                <h3 className="text-lg font-serif-quote font-bold text-white">
                                    Strict Mode — Failure Has Consequences
                                </h3>
                                <p className="text-xs text-white/70 leading-relaxed font-medium">
                                    Enabling Strict Mode imposes direct XP penalties for uncompleted daily routine items. Built for operators demanding uncompromising discipline.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!isPremium) {
                                            setActiveTab('elite');
                                            return;
                                        }
                                        setStrictMode(!strictMode);
                                    }}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                        strictMode ? 'bg-[#D6A52C]' : 'bg-white/20 border border-white/30'
                                    }`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-[#20382B] transition ${
                                        strictMode ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Compact Editorial Legal Matrix */}
                    <div className="space-y-3">
                        <div className="border-l-4 border-l-[#58718A] pl-3 py-0.5">
                            <span className="font-mono-tech text-[10px] text-accent uppercase tracking-widest font-bold block">
                                DOSSIER // 04
                            </span>
                            <h2 className="text-base font-bold text-textMain uppercase tracking-wide">
                                Intel &amp; Policy Matrix
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                                { href: '/about', label: 'About Platform', icon: Info, desc: 'Brand story & founder mission' },
                                { href: '/services', label: 'Services Manual', icon: Target, desc: 'Free vs Elite feature breakdown' },
                                { href: '/contact', label: 'Contact High Command', icon: Mail, desc: 'Operational support & inquiries' },
                                { href: '/privacy', label: 'Privacy Policy', icon: Shield, desc: 'Data protection standards' },
                                { href: '/terms', label: 'Terms of Service', icon: FileText, desc: 'Rules of engagement & protocol' },
                                { href: '/refund', label: 'Refund Policy', icon: FileText, desc: 'Cancellation guidelines' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    target="_blank"
                                    className="bg-[#F3EDE1] p-3.5 rounded-xl border border-border hover:border-accent transition group flex items-start gap-3"
                                >
                                    <item.icon className="w-4 h-4 text-[#58718A] flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-textMain">{item.label}</span>
                                            <ExternalLink className="w-3 h-3 text-textMuted opacity-0 group-hover:opacity-100 transition" />
                                        </div>
                                        <p className="text-[10px] text-textMuted mt-0.5">{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Section 5: Restrained Danger Zone */}
                    <div className="bg-[#B85C3D]/10 border border-[#B85C3D]/30 p-4 rounded-xl flex items-center justify-between gap-4">
                        <div>
                            <span className="font-mono-tech text-[10px] font-bold text-[#B85C3D] uppercase tracking-widest block">DANGER ZONE</span>
                            <p className="text-xs text-textMain font-bold">Sign Out of Session</p>
                            <p className="text-[11px] text-textMuted">Terminate active command session on this device.</p>
                        </div>
                        <form action={async () => { await signOut(); }}>
                            <Button type="submit" variant="danger" className="gap-2 text-xs py-2 px-4 font-mono-tech">
                                <LogOut className="h-3.5 w-3.5" />
                                Sign Out
                            </Button>
                        </form>
                    </div>

                </div>
            )}

            {/* ELITE STATUS TAB — ASYMMETRIC SPLIT COMPOSITION */}
            {activeTab === 'elite' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {/* Left 2 Cols: Deep Olive Editorial Overview */}
                    <div className="lg:col-span-2 bg-[#20382B] text-[#F8F4EB] p-6 sm:p-8 rounded-xl border border-white/10 space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Crown className="h-5 w-5 text-[#D6A52C]" />
                                <span className="font-mono-tech text-xs text-[#D6A52C] uppercase font-bold tracking-widest">
                                    ELITE CLEARANCE PROTOCOL
                                </span>
                            </div>

                            <h2 className="text-3xl font-serif-quote font-bold text-white">
                                Maximum Accountability Arsenal
                            </h2>

                            <p className="text-xs text-white/70 leading-relaxed max-w-lg font-medium">
                                Upgrade your command center clearance to access strategic multi-quarter goal campaigns, 30-day historical debrief telemetry, and strict mode XP penalties.
                            </p>

                            <div className="space-y-2.5 pt-3 border-t border-white/10">
                                {[
                                    { title: 'Strategic Goal Campaigns', desc: 'Set short-term, mid-term, and multi-year North Star objectives.' },
                                    { title: '30-Day Debrief Telemetry', desc: 'Analyze historical discipline scores, energy trends, and CSV data exports.' },
                                    { title: 'Strict Accountability Penalty System', desc: 'Direct XP consequences for uncompleted daily routine checklist items.' },
                                    { title: 'Priority Operational Telemetry', desc: 'Direct feedback routing to High Command.' },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-2.5">
                                        <CheckCircle2 className="h-4 w-4 text-[#D6A52C] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-xs font-bold text-white block">{item.title}</span>
                                            <span className="text-[11px] text-white/60">{item.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-tech text-white/60">
                            <span>CLEARANCE PROTOCOL: ELITE</span>
                            <span>RECURRING MONTHLY BILLING</span>
                        </div>
                    </div>

                    {/* Right 1 Col: Saffron Price & Action Badge */}
                    <div className="bg-[#F3EDE1] p-6 rounded-xl border border-border flex flex-col justify-between text-center space-y-6">
                        <div className="space-y-4">
                            <span className="font-mono-tech text-[10px] text-textMuted uppercase tracking-widest font-bold block">
                                OPERATIONAL SUBSCRIPTION
                            </span>

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#20382B] text-[#D6A52C] shadow-md">
                                <Crown className="h-7 w-7 fill-[#D6A52C]" />
                            </div>

                            <div>
                                <span className="text-4xl font-black text-textMain tabular-nums">₹100</span>
                                <span className="text-xs text-textMuted font-mono-tech block mt-1">/ MONTH</span>
                            </div>

                            <p className="text-xs text-textSecondary leading-relaxed">
                                Processed securely via Razorpay PCI-DSS standards. Cancel anytime from Settings.
                            </p>
                        </div>

                        <Button
                            variant="primary"
                            onClick={() => toast('Elite Protocol enrollment launching soon!', 'info')}
                            className="w-full bg-[#D6A52C] text-[#20382B] hover:bg-[#c49526] font-bold py-3.5 uppercase tracking-wider text-xs shadow-md"
                        >
                            Initiate Upgrade (₹100/mo)
                        </Button>
                    </div>
                </div>
            )}

            {/* FEEDBACK TAB */}
            {activeTab === 'feedback' && (
                <div className="bg-[#F3EDE1] p-6 rounded-xl border border-border space-y-4">
                    <span className="font-mono-tech text-[10px] font-bold text-accent uppercase tracking-widest block">COMMAND TRANSMISSION</span>
                    <h2 className="text-xl font-bold text-textMain">Transmit Feedback to High Command</h2>
                    <p className="text-xs text-textSecondary">
                        Transmit feature requests, bug anomalies, or operational debrief notes directly to HQ.
                    </p>
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <select
                            value={feedback.category}
                            onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
                            className="w-full rounded-lg border border-border bg-surface p-2.5 text-xs text-textMain font-mono-tech"
                        >
                            <option value="general">General Feedback</option>
                            <option value="feature_request">Feature Request (Tactical Upgrade)</option>
                            <option value="bug">Bug Report (System Anomaly)</option>
                        </select>
                        <textarea
                            value={feedback.message}
                            onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                            className="w-full rounded-lg border border-border bg-surface p-3 text-xs text-textMain min-h-[120px]"
                            placeholder="Enter operational transmission..."
                            required
                        />
                        <Button type="submit" disabled={isSubmittingFeedback || !feedback.message.trim()} className="bg-[#20382B] text-white hover:bg-[#16271e]">
                            {isSubmittingFeedback ? 'Transmitting...' : 'Transmit Feedback'}
                        </Button>
                        {feedbackStatus === 'success' && (
                            <p className="text-xs text-accent font-mono-tech font-semibold">Transmission successful. Command acknowledges.</p>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}
