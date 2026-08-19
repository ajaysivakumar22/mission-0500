'use client';

import Link from 'next/link';
import { Shield, Target, BarChart3, Zap, Clock, Trophy, ChevronRight } from 'lucide-react';

const FEATURES = [
    {
        icon: Clock,
        title: 'Daily Routines',
        description: 'Build non-negotiable habits with daily routine tracking. Choose from 4 archetype templates or customize your own.',
    },
    {
        icon: Target,
        title: 'Goal Tracking',
        description: 'Set strategic long-term and short-term objectives. Track progress percentage and maintain momentum.',
    },
    {
        icon: BarChart3,
        title: 'After-Action Reviews',
        description: 'Daily debrief reports capturing accomplishments, failures, adaptations, and live radar telemetry.',
    },
    {
        icon: Zap,
        title: 'XP & Rank System',
        description: 'Earn XP for every completed task and routine item. Advance through operational clearance ranks.',
    },
    {
        icon: Trophy,
        title: 'Commendations Rack',
        description: 'Unlock achievement medals for streak consistency and relentless execution.',
    },
    {
        icon: Shield,
        title: 'Strict Mode',
        description: 'Enable optional Strict Mode accountability — missed routines deal direct XP penalties.',
    },
];

const ARCHETYPES = [
    { name: 'Operator', desc: 'Tactical discipline & routine execution', color: '#D6A52C' },
    { name: 'Scholar', desc: 'Deep work, study & research focus', color: '#58718A' },
    { name: 'Athlete', desc: 'Physical endurance & health tracking', color: '#71866B' },
    { name: 'Protagonist', desc: 'High-stakes goal conquest', color: '#B85C3D' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-textMain flex flex-col justify-between">
            {/* Header / Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#20382B] text-[#D6A52C]">
                            <Shield className="h-4 w-4 fill-[#D6A52C]" />
                        </div>
                        <div>
                            <span className="font-mono-tech text-[10px] text-accent uppercase tracking-widest block leading-none">MISSION</span>
                            <span className="text-base font-black text-textMain tracking-wider block">0500</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-xs font-semibold text-textSecondary hover:text-textMain transition px-3 py-1.5"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/login"
                            className="text-xs font-bold bg-[#D6A52C] text-[#20382B] px-4 py-2 rounded-xl hover:bg-[#c49526] transition shadow-sm uppercase tracking-wide"
                        >
                            Enlist Now
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-24">
                {/* Hero Section */}
                <section className="py-16 md:py-24 px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1 mb-6 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="font-mono-tech text-xs text-textMuted uppercase tracking-widest font-semibold">Personal Command Center</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-serif-quote font-bold text-textMain tracking-tight leading-tight mb-6">
                            Discipline Is The <br />
                            <span className="text-accent italic font-normal">Only Strategy</span>
                        </h1>

                        <p className="text-base md:text-lg text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                            Track non-negotiable routines, execute objectives, earn XP, and climb clearance ranks. Built for individuals serious about daily execution.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 bg-[#D6A52C] text-[#20382B] px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[#c49526] transition shadow-md hover-lift"
                            >
                                Begin Your Mission
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Archetype Section — Deep Olive Anchor Panel */}
                <section className="py-14 px-6 bg-[#20382B] text-[#F8F4EB] border-y border-white/10">
                    <div className="max-w-5xl mx-auto">
                        <span className="font-mono-tech text-xs text-[#D6A52C] uppercase tracking-widest block text-center mb-2 font-bold">OPERATING PROFILES</span>
                        <h2 className="text-2xl md:text-3xl font-serif-quote text-center text-white mb-10">Select Your Archetype</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ARCHETYPES.map((a) => (
                                <div key={a.name} className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <span className="font-bold text-lg uppercase tracking-wide block mb-1" style={{ color: a.color }}>
                                        {a.name}
                                    </span>
                                    <p className="text-xs text-white/70 leading-relaxed">{a.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-14">
                            <span className="font-mono-tech text-xs text-accent uppercase tracking-widest block mb-1">SYSTEM ARSENAL</span>
                            <h2 className="text-3xl font-bold text-textMain tracking-tight">Built For Daily Execution</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="card p-6 hover-lift">
                                    <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center text-accent mb-4">
                                        <f.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-bold text-textMain mb-1.5">{f.title}</h3>
                                    <p className="text-xs text-textSecondary leading-relaxed">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-surface py-10 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
                        <div>
                            <span className="font-mono-tech text-accent uppercase font-bold tracking-widest block mb-3">Navigation</span>
                            <ul className="space-y-2 text-textSecondary font-medium">
                                <li><Link href="/about" className="hover:text-textMain transition">About</Link></li>
                                <li><Link href="/services" className="hover:text-textMain transition">Services</Link></li>
                                <li><Link href="/contact" className="hover:text-textMain transition">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-mono-tech text-accent uppercase font-bold tracking-widest block mb-3">Legal</span>
                            <ul className="space-y-2 text-textSecondary font-medium">
                                <li><Link href="/privacy" className="hover:text-textMain transition">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-textMain transition">Terms &amp; Conditions</Link></li>
                                <li><Link href="/refund" className="hover:text-textMain transition">Refund Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-mono-tech text-accent uppercase font-bold tracking-widest block mb-3">Account</span>
                            <ul className="space-y-2 text-textSecondary font-medium">
                                <li><Link href="/login" className="hover:text-textMain transition">Sign In</Link></li>
                                <li><Link href="/login" className="hover:text-textMain transition">Enlist Now</Link></li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-mono-tech text-accent uppercase font-bold tracking-widest block mb-3">Contact</span>
                            <p className="text-textSecondary break-all font-mono-tech">mission0500commandcentre@gmail.com</p>
                        </div>
                    </div>

                    <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-textMuted font-mono-tech">
                        <span>MISSION 0500 · PERSONAL DISCIPLINE OPERATING SYSTEM</span>
                        <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
