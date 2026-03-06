'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateUserProfile, signOut } from '@/server/actions/auth';
import { updateUserSettings } from '@/server/actions/settings';
import { submitFeedback } from '@/server/actions/feedback';
import { useTheme } from '@/lib/context/ThemeContext';
import { LogOut, Save, ShieldAlert, Crown, Paintbrush, Zap, BookOpen, User, Target, Activity, MessageSquare } from 'lucide-react';

interface SettingsClientProps {
    userId: string;
    fullName: string;
    email: string;
    initialStrictMode: boolean;
    isPremium: boolean;
}

export default function SettingsClient({ userId, fullName, email, initialStrictMode, isPremium }: SettingsClientProps) {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'config' | 'elite' | 'feedback'>('config');
    const [isSaving, setIsSaving] = useState(false);
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
                alert('Profile & Settings updated successfully');
            } else {
                alert(result.error || settingsResult.error || 'Failed to update system');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <MainLayout>
            <div className="w-full space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    title="Configuration Protocol"
                    subtitle="Manage your identity. True power comes from knowing yourself."
                />

                <InspirationalQuote />

                {/* Tabs */}
                <div className="flex w-full gap-2 rounded-xl bg-[#0B1D13] p-1 border border-[#1E3A2A]">
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`flex-1 rounded-lg py-3 text-sm font-bold transition-all ${activeTab === 'config'
                            ? 'bg-primary text-textMain shadow-md'
                            : 'text-textMuted hover:text-textMain hover:bg-surface'
                            }`}
                    >
                        Configuration
                    </button>
                    <button
                        onClick={() => setActiveTab('elite')}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${activeTab === 'elite'
                            ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent border border-accent/30 shadow-[0_0_15px_rgba(255,214,10,0.2)]'
                            : 'text-textMuted hover:text-accent hover:bg-surface'
                            }`}
                    >
                        <Crown className="h-4 w-4" />
                        Elite Status
                    </button>
                    <button
                        onClick={() => setActiveTab('feedback')}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${activeTab === 'feedback'
                            ? 'bg-primary text-textMain shadow-md border border-primary/30'
                            : 'text-textMuted hover:text-textMain hover:bg-surface'
                            }`}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Feedback
                    </button>
                </div>

                {activeTab === 'config' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Profile Section */}
                        <div className="rounded-2xl border border-white/10 bg-surface/80 p-8 backdrop-blur-md shadow-lg">
                            <h2 className="mb-6 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-textMuted uppercase tracking-wide">Officer Profile</h2>

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <Input
                                    label="Full Name"
                                    value={formData.full_name}
                                    onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={isSaving}
                                    className="gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    Save Changes
                                </Button>
                            </form>
                        </div>

                        {/* Theme Configuration */}
                        <div className="rounded-2xl border border-white/10 bg-surface/80 p-8 backdrop-blur-md shadow-lg">
                            <h2 className="mb-6 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-textMuted uppercase tracking-wide">System Theme</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { id: 'operator', name: 'Operator', icon: ShieldAlert, color: 'text-green-500', bg: 'bg-[#0B1D13]', border: 'border-[#1E3A2A]' },
                                    { id: 'scholar', name: 'Scholar', icon: BookOpen, color: 'text-blue-400', bg: 'bg-[#0B0E14]', border: 'border-[#232D3B]' },
                                    { id: 'athlete', name: 'Athlete', icon: Zap, color: 'text-red-500', bg: 'bg-[#000000]', border: 'border-[#222222]' },
                                    { id: 'protagonist', name: 'Protagonist', icon: User, color: 'text-purple-400', bg: 'bg-[#0D0814]', border: 'border-[#2A183D]' }
                                ].map((t) => {
                                    const Icon = t.icon;
                                    const isActive = theme === t.id;

                                    return (
                                        <div
                                            key={t.id}
                                            onClick={() => setTheme(t.id as any)}
                                            className={`relative cursor-pointer rounded-xl p-4 transition-all duration-300 border ${t.bg} ${t.border} ${isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-background scale-[1.02] shadow-[0_0_20px_rgba(var(--theme-accent),0.2)]' : 'hover:scale-105 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className={`p-3 rounded-full bg-black/40 ${t.color}`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <span className={`font-bold uppercase tracking-wider text-sm ${isActive ? 'text-accent' : 'text-textMuted'}`}>
                                                    {t.name}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Accountability Protocols */}
                        <div className="rounded-2xl border border-accent/30 bg-surface/80 p-8 backdrop-blur-md shadow-lg transition-all hover:border-accent/50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <ShieldAlert className={`h-6 w-6 ${strictMode ? 'text-red-500' : 'text-accent'}`} />
                                        <h2 className="text-xl font-black text-textMain uppercase tracking-wide">
                                            Strict Accountability Mode
                                        </h2>
                                        {!isPremium && (
                                            <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent border border-accent/40">ELITE</span>
                                        )}
                                    </div>
                                    <p className="max-w-xl text-sm font-medium text-textMuted mb-6">
                                        Enabling Strict Mode introduces severe consequences for failure. Breaking a routine streak will deal massive XP damage. This mode is only for aspirants seeking absolute discipline.
                                        {!isPremium && <span className="block mt-2 text-accent/80">You must upgrade to the <button onClick={() => setActiveTab('elite')} className="underline hover:text-accent">Elite Protocol</button> to unlock this protocol.</span>}
                                    </p>
                                </div>

                                {/* Toggle Switch UI */}
                                <div
                                    onClick={() => {
                                        if (!isPremium) {
                                            setActiveTab('elite');
                                            return;
                                        }
                                        setStrictMode(!strictMode);
                                    }}
                                    className={`relative inline-flex h-8 w-16 ${isPremium ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${strictMode ? 'bg-red-600' : 'bg-gray-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition duration-300 ${strictMode ? 'translate-x-9' : 'translate-x-1'
                                            } shadow-md`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="rounded-2xl border border-red-500/30 bg-red-900/10 p-8 backdrop-blur-md shadow-lg transition-all hover:border-red-500/50">
                            <h2 className="mb-4 text-xl font-black text-red-400 uppercase tracking-wide">Danger Zone</h2>
                            <p className="mb-6 text-sm text-red-300 font-medium">
                                Once you sign out, you&apos;ll need to establish clearance again.
                            </p>
                            <form action={async () => { await signOut(); }}>
                                <Button
                                    type="submit"
                                    variant="danger"
                                    className="gap-2"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Elite Protocol Tab */}
                {activeTab === 'elite' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-surface/90 p-10 text-center shadow-[0_0_50px_rgba(var(--theme-accent),0.1)] backdrop-blur-md">
                            {/* Glowing orb background */}
                            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-20 blur-[100px]"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-accent bg-background shadow-[0_0_30px_rgba(var(--theme-accent),0.3)]">
                                    <Crown className="h-10 w-10 text-accent animate-pulse" />
                                </div>

                                <h2 className="mb-4 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-white uppercase tracking-widest">
                                    ELITE PROTOCOL
                                </h2>
                                <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-textMuted">
                                    You are currently operating on Phase 1 authorization. Upgrade to the ELITE Protocol
                                    to unlock advanced tactical telemetry, the long-term strategic Goals board, and unrestricted customization.
                                </p>

                                <div className="mb-10 grid w-full max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
                                    <div className="rounded-xl border border-border bg-background/50 p-5">
                                        <Target className="mb-3 h-8 w-8 text-accent" />
                                        <h3 className="mb-1 font-bold text-textMain">Strategic Goals</h3>
                                        <p className="text-xs text-textMuted">Unlock the yearly goals system and break them down into actionable targets.</p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-background/50 p-5">
                                        <Activity className="mb-3 h-8 w-8 text-accent" />
                                        <h3 className="mb-1 font-bold text-textMain">Deep Telemetry</h3>
                                        <p className="text-xs text-textMuted">Unrestricted access to historical performance data and AI forecasting.</p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-background/50 p-5 sm:col-span-2 lg:col-span-1">
                                        <Zap className="mb-3 h-8 w-8 text-accent" />
                                        <h3 className="mb-1 font-bold text-textMain">Unlimited Flow</h3>
                                        <p className="text-xs text-textMuted">Sync with third-party calendars to eliminate operational friction.</p>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="px-12 py-6 text-lg font-black tracking-wider uppercase transition-transform hover:scale-105"
                                >
                                    Initiate Elite Upgrade (₹100/mo)
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback Protocol Tab */}
                {activeTab === 'feedback' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="rounded-2xl border border-white/10 bg-surface/80 p-8 backdrop-blur-md shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageSquare className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-textMuted uppercase tracking-wide">Command Comms</h2>
                            </div>
                            <p className="text-sm text-textMuted mb-6">
                                Transmit bug reports, feature requests, or general feedback directly to HIGH COMMAND. Your intelligence stream shapes the future of Mission 0500.
                            </p>

                            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-textMain uppercase tracking-wider">Classification</label>
                                    <select
                                        value={feedback.category}
                                        onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="general">General Transmission</option>
                                        <option value="feature_request">Feature Request (Tactical Upgrade)</option>
                                        <option value="bug">Bug Report (System Anomaly)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-textMain uppercase tracking-wider">Message Payload</label>
                                    <textarea
                                        value={feedback.message}
                                        onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[150px]"
                                        placeholder="Enter your transmission payload here..."
                                        required
                                    ></textarea>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={isSubmittingFeedback || !feedback.message.trim()} 
                                    className="w-full flex justify-center items-center gap-2"
                                >
                                    {isSubmittingFeedback ? 'Transmitting...' : 'Transmit to Command'}
                                </Button>
                                {feedbackStatus === 'success' && (
                                    <p className="text-center text-accent text-sm font-medium animate-pulse mt-2">
                                        Transmission successful. Command acknowledges.
                                    </p>
                                )}
                                {feedbackStatus === 'error' && (
                                    <p className="text-center text-red-500 text-sm font-medium mt-2">
                                        Transmission failed. Signal lost.
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
