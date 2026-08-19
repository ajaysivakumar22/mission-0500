import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Target, BarChart3, Zap, Trophy, Clock, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About',
    description: 'Learn about Mission 0500 — a personal discipline and accountability platform for tracking routines, goals, and performance.',
};

export default function AboutPage() {
    return (
        <article className="space-y-10 animate-slide-in">
            {/* Heading */}
            <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-accent font-bold block mb-1">INTEL BRIEFING</span>
                <h1 className="text-3xl sm:text-4xl font-serif-quote font-bold text-textMain tracking-tight mb-3">About Mission 0500</h1>
                <p className="text-base text-textSecondary leading-relaxed max-w-2xl">
                    A personal command center built for individuals serious about daily execution.
                </p>
            </div>

            {/* What is Mission 0500 */}
            <section className="card p-6">
                <h2 className="text-lg font-bold text-textMain mb-3">What Is Mission 0500?</h2>
                <div className="space-y-3 text-sm text-textSecondary leading-relaxed">
                    <p>
                        Mission 0500 is a personal discipline operating system. It helps users establish non-negotiable habits through daily routine checklists, strategic goal tracking, after-action reviews, and gamified progress telemetry — earning XP, advancing through clearance ranks, and acquiring commendation medals.
                    </p>
                    <p>
                        The designation &quot;0500&quot; represents 5:00 AM — the hour when disciplined operators begin their morning routine before the world starts demanding attention. The platform is designed for anyone taking complete ownership of their daily output.
                    </p>
                </div>
            </section>

            {/* Core Features */}
            <section className="space-y-4">
                <h2 className="text-lg font-bold text-textMain">Platform Arsenal</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: Clock, title: 'Daily Routines', desc: 'Build non-negotiable habits with daily routine checklists. Choose from archetype templates or build custom routines.' },
                        { icon: Target, title: 'Goal Tracking', desc: 'Set short-term and long-term targets. Track progress percentage and maintain execution momentum.' },
                        { icon: BarChart3, title: 'After-Action Reviews', desc: 'Daily debrief reports with performance ratings and live telemetry indicators.' },
                        { icon: Zap, title: 'XP & Rank System', desc: 'Earn XP for every completed action. Advance through operational clearance ranks.' },
                        { icon: Trophy, title: 'Medals & Streaks', desc: 'Unlock achievement commendation medals for consistency and streak milestones.' },
                        { icon: Shield, title: 'Strict Mode', desc: 'Optional accountability mode — missed routine items result in XP penalties.' },
                    ].map((f) => (
                        <div key={f.title} className="card-muted p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center flex-shrink-0 text-accent mt-0.5">
                                    <f.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-textMain mb-1">{f.title}</h3>
                                    <p className="text-xs text-textSecondary leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Founder */}
            <section className="card p-6 border-l-4 border-l-[#20382B]">
                <h2 className="text-lg font-bold text-textMain mb-6">The Founder</h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-accent flex-shrink-0">
                        <Image
                            src="/founder.jpg"
                            alt="Ajay Sivakumar — Founder of Mission 0500"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-3 text-center sm:text-left">
                        <div>
                            <h3 className="text-lg font-bold text-textMain">Ajay Sivakumar</h3>
                            <span className="font-mono-tech text-xs text-accent uppercase tracking-widest block font-bold">Founder &amp; Creator</span>
                        </div>
                        <div className="space-y-2 text-xs text-textSecondary leading-relaxed">
                            <p>
                                Built Mission 0500 out of a personal need — a system that doesn&apos;t let you off the hook. Most apps track what you plan; Mission 0500 tracks whether you actually executed.
                            </p>
                            <p>
                                Technology should serve purpose, not distraction. Mission 0500 exists to help people stop planning and start executing — one day at a time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="card p-6 text-center bg-[#20382B] text-[#F8F4EB] border border-white/10">
                <h2 className="text-xl font-serif-quote font-bold text-white mb-2">Ready to Start Your Mission?</h2>
                <p className="text-xs text-white/70 mb-5">Free to enlist. Build your daily discipline system now.</p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-[#D6A52C] text-[#20382B] px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#c49526] transition shadow-md"
                >
                    Enlist Now
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </section>
        </article>
    );
}
