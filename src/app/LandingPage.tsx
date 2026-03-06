'use client';

import Link from 'next/link';
import { Shield, Target, BarChart3, Zap, Clock, Trophy, ChevronRight, Crosshair } from 'lucide-react';

const FEATURES = [
    {
        icon: Clock,
        title: 'Daily Routines',
        description: 'Build unbreakable habits with daily routine tracking. Choose from 4 archetype templates or create your own.',
    },
    {
        icon: Target,
        title: 'Goal Tracking',
        description: 'Set long-term and short-term objectives. Log progress entries and watch momentum build.',
    },
    {
        icon: BarChart3,
        title: 'Performance Reports',
        description: 'Daily after-action reports with mood, energy, and discipline ratings. Spot patterns over time.',
    },
    {
        icon: Zap,
        title: 'XP & Rank System',
        description: 'Earn XP for every completed task and routine. Climb through military ranks as you level up.',
    },
    {
        icon: Trophy,
        title: 'Medals & Streaks',
        description: 'Unlock achievement medals for consistency. Track your execution streak and never break the chain.',
    },
    {
        icon: Shield,
        title: 'Strict Mode',
        description: 'Enable Strict Mode for accountability — skip a routine or task and face an XP penalty.',
    },
];

const ARCHETYPES = [
    { name: 'Operator', desc: 'Military precision & discipline', color: '#FFD60A' },
    { name: 'Scholar', desc: 'Academic focus & deep learning', color: '#60A5FA' },
    { name: 'Builder', desc: 'Ship fast, iterate faster', color: '#34D399' },
    { name: 'Athlete', desc: 'Peak physical performance', color: '#F87171' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0B1D13] text-[#E8E8E8]">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1D13]/90 backdrop-blur-md border-b border-[#1E3A2A]">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Crosshair className="w-6 h-6 text-[#FFD60A]" />
                        <span className="text-lg font-black uppercase tracking-wider text-white">Mission 0500</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm text-[#9CA3AF] hover:text-white transition px-4 py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm font-bold bg-[#FFD60A] text-[#0B1D13] px-5 py-2 rounded-lg hover:bg-[#e6c209] transition uppercase tracking-wide"
                        >
                            Enlist Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Subtle grid background */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(#FFD60A 1px, transparent 1px), linear-gradient(90deg, #FFD60A 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />

                <div className="max-w-4xl mx-auto text-center relative">
                    <div className="inline-flex items-center gap-2 bg-[#162B20] border border-[#1E3A2A] rounded-full px-4 py-1.5 mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#FFD60A] animate-pulse" />
                        <span className="text-xs text-[#9CA3AF] uppercase tracking-widest font-semibold">Personal Command Center</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-[1.1] mb-6">
                        Discipline Is The
                        <span className="block text-[#FFD60A]">Only Strategy</span>
                    </h1>

                    <p className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-10 leading-relaxed">
                        Track routines, crush goals, earn XP, climb ranks. A military-grade accountability system 
                        for people who execute — not just plan.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/login"
                            className="flex items-center gap-2 bg-[#FFD60A] text-[#0B1D13] px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-lg hover:bg-[#e6c209] transition shadow-[0_0_30px_rgba(255,214,10,0.15)]"
                        >
                            Begin Your Mission
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                        <span className="text-sm text-[#6B7280]">Free. No credit card required.</span>
                    </div>
                </div>
            </section>

            {/* Archetypes bar */}
            <section className="py-12 px-6 border-y border-[#1E3A2A] bg-[#0d2317]">
                <div className="max-w-5xl mx-auto">
                    <p className="text-center text-xs uppercase tracking-[0.3em] text-[#6B7280] mb-8 font-semibold">Choose Your Archetype</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ARCHETYPES.map((a) => (
                            <div key={a.name} className="text-center p-4 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                                <div className="text-lg font-bold uppercase" style={{ color: a.color }}>{a.name}</div>
                                <div className="text-xs text-[#6B7280] mt-1">{a.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white text-center uppercase tracking-wide mb-4">
                        Your Arsenal
                    </h2>
                    <p className="text-center text-[#9CA3AF] mb-14 max-w-xl mx-auto">
                        Everything you need to dominate your day, track your progress, and hold yourself accountable.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="p-6 rounded-xl bg-[#162B20] border border-[#1E3A2A] hover:border-[#FFD60A]/30 transition group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#0B1D13] border border-[#1E3A2A] flex items-center justify-center mb-4 group-hover:border-[#FFD60A]/40 transition">
                                    <f.icon className="w-5 h-5 text-[#FFD60A]" />
                                </div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">{f.title}</h3>
                                <p className="text-sm text-[#9CA3AF] leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 px-6 bg-[#0d2317] border-y border-[#1E3A2A]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white text-center uppercase tracking-wide mb-14">
                        How It Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Enlist', desc: 'Sign up, pick your archetype, and set your 90-day primary directive.' },
                            { step: '02', title: 'Execute', desc: 'Complete daily routines, tasks, and log reports. Earn XP for every action.' },
                            { step: '03', title: 'Dominate', desc: 'Climb ranks, unlock medals, build unstoppable momentum.' },
                        ].map((s) => (
                            <div key={s.step} className="text-center">
                                <div className="text-5xl font-black text-[#FFD60A]/20 mb-3">{s.step}</div>
                                <h3 className="text-xl font-bold text-white uppercase mb-2">{s.title}</h3>
                                <p className="text-sm text-[#9CA3AF]">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide mb-4">
                        Stop Planning. Start Executing.
                    </h2>
                    <p className="text-[#9CA3AF] mb-8 max-w-lg mx-auto">
                        Every day you wait is a day wasted. Your mission starts now.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 bg-[#FFD60A] text-[#0B1D13] px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-lg hover:bg-[#e6c209] transition shadow-[0_0_30px_rgba(255,214,10,0.15)]"
                    >
                        Enlist Now
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-[#1E3A2A]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Crosshair className="w-4 h-4 text-[#FFD60A]" />
                        <span className="text-sm font-bold uppercase tracking-wider text-[#6B7280]">Mission 0500</span>
                    </div>
                    <p className="text-xs text-[#4B5563]">Discipline over motivation. Execution over intention.</p>
                </div>
            </footer>
        </div>
    );
}
