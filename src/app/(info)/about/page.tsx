import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Target, BarChart3, Zap, Trophy, Clock, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About',
    description: 'Learn about Mission 0500 — a military-grade personal discipline and accountability platform for tracking routines, goals, and performance.',
};

export default function AboutPage() {
    return (
        <article>
            {/* Heading */}
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-[#FFD60A] font-semibold mb-3">Intel Briefing</p>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">About Mission 0500</h1>
                <p className="text-lg text-[#9CA3AF] leading-relaxed max-w-2xl">
                    A personal discipline command center built for people who execute — not just plan.
                </p>
            </div>

            {/* What is Mission 0500 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">What Is Mission 0500?</h2>
                <div className="space-y-4 text-[#9CA3AF] leading-relaxed">
                    <p>
                        Mission 0500 is a military-themed personal accountability and productivity platform. It helps 
                        individuals build discipline through structured daily routines, goal tracking, performance 
                        reporting, and gamified progress — earning XP, climbing ranks, and unlocking medals along the way.
                    </p>
                    <p>
                        The name &quot;0500&quot; represents 5:00 AM — the hour when disciplined operators begin their day 
                        before the rest of the world wakes up. The platform is designed for anyone who wants to take 
                        complete ownership of their daily execution.
                    </p>
                </div>
            </section>

            {/* The Problem */}
            <section className="mb-12 p-6 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">The Problem We Solve</h2>
                <div className="space-y-4 text-[#9CA3AF] leading-relaxed">
                    <p>
                        Most productivity tools focus on planning. They give you lists, calendars, and pretty dashboards — 
                        but they don&apos;t hold you accountable for actually executing. When motivation fades, plans 
                        collect dust.
                    </p>
                    <p>
                        Mission 0500 flips the script. It&apos;s built on a simple philosophy: <span className="text-[#FFD60A] font-semibold">discipline 
                        over motivation, execution over intention.</span> We track what you actually do every day, 
                        reward consistency, and penalise excuses.
                    </p>
                </div>
            </section>

            {/* Core Features */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-6">Your Arsenal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: Clock, title: 'Daily Routines', desc: 'Build unbreakable habits with daily checklist routines. Choose from 4 archetype templates or create your own.' },
                        { icon: Target, title: 'Goal Tracking', desc: 'Set short-term and long-term objectives. Log progress entries and track momentum over time.' },
                        { icon: BarChart3, title: 'Performance Reports', desc: 'Daily after-action reports with mood, energy, and discipline ratings. Spot patterns and improve.' },
                        { icon: Zap, title: 'XP & Rank System', desc: 'Earn XP for every completed task, routine, and report. Climb military ranks from Cadet to Commander.' },
                        { icon: Trophy, title: 'Medals & Streaks', desc: 'Unlock achievement medals for consistency. Track your execution streak.' },
                        { icon: Shield, title: 'Strict Mode', desc: 'Enable accountability mode — miss a routine or task and face XP penalties. No excuses.' },
                    ].map((f) => (
                        <div key={f.title} className="p-5 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-[#0B1D13] border border-[#1E3A2A] flex items-center justify-center flex-shrink-0">
                                    <f.icon className="w-4 h-4 text-[#FFD60A]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-1">{f.title}</h3>
                                    <p className="text-sm text-[#9CA3AF] leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Mission */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">Our Mission</h2>
                <div className="space-y-4 text-[#9CA3AF] leading-relaxed">
                    <p>
                        We believe that discipline is the only strategy that works when motivation fails. Mission 0500 
                        exists to give individuals a structured, gamified system that makes daily execution rewarding 
                        and measurable.
                    </p>
                    <p>
                        Whether you&apos;re a student, professional, athlete, or builder — if you want to show up every 
                        day and put in the work, this platform is your command center.
                    </p>
                </div>
            </section>

            {/* Founder */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-8">The Founder</h2>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#FFD60A]/40 shadow-[0_0_30px_rgba(255,214,10,0.15)]">
                            <Image
                                src="/founder.jpg"
                                alt="Ajay Sivakumar — Founder of Mission 0500"
                                width={160}
                                height={160}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    {/* Bio */}
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-black text-white uppercase tracking-wide mb-1">Ajay Sivakumar</h3>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#FFD60A] font-semibold mb-4">Founder &amp; Creator</p>
                        <div className="space-y-3 text-[#9CA3AF] leading-relaxed">
                            <p>
                                As an engineering student with a deep interest in defence and national service, Ajay built 
                                Mission 0500 out of a personal need — the need for a system that doesn&apos;t let you off the 
                                hook. Most apps track what you plan; this one tracks whether you actually showed up.
                            </p>
                            <p>
                                The idea was born from a simple observation: the most effective people — soldiers, athletes, 
                                top performers — don&apos;t rely on motivation. They rely on structure, discipline, and daily 
                                accountability. Mission 0500 takes that philosophy and puts it into a system anyone can use.
                            </p>
                            <p>
                                Built with the belief that <span className="text-[#FFD60A] font-semibold">technology should serve purpose, not distraction</span>, 
                                this platform exists to help people stop planning and start executing — one day at a time, 
                                starting at 0500 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center p-8 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-3">Ready to Start Your Mission?</h2>
                <p className="text-[#9CA3AF] mb-6">Free to enlist. No credit card required.</p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-[#FFD60A] text-[#0B1D13] px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-[#e6c209] transition"
                >
                    Enlist Now
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </section>
        </article>
    );
}
