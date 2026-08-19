import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Target, BarChart3, Zap, Trophy, Shield, Star, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Services',
    description: 'Explore Mission 0500 services — daily routines, goal tracking, performance reports, XP system, medals, and premium features.',
};

export default function ServicesPage() {
    return (
        <article className="space-y-10 animate-slide-in">
            {/* Heading */}
            <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-accent font-bold block mb-1">OPERATIONS MANUAL</span>
                <h1 className="text-3xl sm:text-4xl font-serif-quote font-bold text-textMain tracking-tight mb-3">Our Services</h1>
                <p className="text-base text-textSecondary leading-relaxed max-w-2xl">
                    Mission 0500 is a personal discipline operating system. Here is the operational capability catalogue.
                </p>
            </div>

            {/* How it works */}
            <section className="space-y-4">
                <h2 className="text-lg font-bold text-textMain">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { step: '01', title: 'Enlist', desc: 'Create your account, choose your operating profile (Operator, Scholar, Athlete, or Protagonist), and set your primary directive.' },
                        { step: '02', title: 'Execute', desc: 'Complete daily routines, manage objectives, log after-action reports, and track goals. Earn XP toward operational clearance.' },
                        { step: '03', title: 'Dominate', desc: 'Maintain execution streaks, unlock commendation medals, advance from Cadet to Commander, and conquer your goals.' },
                    ].map((s) => (
                        <div key={s.step} className="card p-5 text-center">
                            <div className="font-mono-tech text-3xl font-black text-accent/30 mb-1">{s.step}</div>
                            <h3 className="text-base font-bold text-textMain mb-1.5">{s.title}</h3>
                            <p className="text-xs text-textSecondary leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Free Tier Features */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-bold text-textMain">Free Tier — Phase 1 Authorization</h2>
                    <p className="text-xs text-textSecondary mt-0.5">Everything needed to build daily discipline. No payment required.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: Clock, title: 'Daily Routines', desc: 'Create and track non-negotiable routine checklists. Choose from 4 archetype templates or customize.' },
                        { icon: Target, title: 'Goal Tracking', desc: 'Set short-term and long-term targets. Log progress notes and monitor momentum.' },
                        { icon: BarChart3, title: 'Daily Reports', desc: 'Submit after-action reviews with self-assessed energy, discipline, and execution ratings.' },
                        { icon: Zap, title: 'XP & Rank System', desc: 'Earn XP for completing routine items and objectives. Progress through clearance ranks.' },
                        { icon: Trophy, title: 'Medals & Streaks', desc: 'Unlock achievement medals for consistency milestones and streak preservation.' },
                        { icon: Star, title: 'Task Management', desc: 'Create, prioritize, and execute daily objectives with priority badges.' },
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

            {/* Premium Tier */}
            <section className="card p-6 border-l-4 border-l-accent space-y-4">
                <div>
                    <span className="font-mono-tech text-xs text-accent font-bold uppercase tracking-widest block mb-1">PREMIUM UPGRADE</span>
                    <h2 className="text-xl font-bold text-textMain">Elite Protocol — ₹100 / month</h2>
                    <p className="text-xs text-textSecondary mt-0.5">Unlock strategic goals, 30-day telemetry, and strict mode.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { title: 'Strategic Goals Board', desc: 'Access multi-quarter strategic goal planning and campaign milestone tracking.' },
                        { title: 'Deep Telemetry', desc: 'Unlock 30-day performance telemetry, CSV exports, and historical debrief analysis.' },
                        { title: 'Unlimited Flow', desc: 'Expanded capacity for power users to manage multiple routine tracks.' },
                        { title: 'Strict Accountability Mode', desc: 'Enable optional XP penalties for missed daily routine items.' },
                    ].map((f) => (
                        <div key={f.title} className="card-muted p-4 space-y-1">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-accent flex-shrink-0" />
                                <h3 className="text-xs font-bold text-textMain">{f.title}</h3>
                            </div>
                            <p className="text-xs text-textSecondary leading-relaxed pl-6">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="card p-6 text-center bg-[#20382B] text-[#F8F4EB] border border-white/10">
                <h2 className="text-xl font-serif-quote font-bold text-white mb-2">Start Your Mission</h2>
                <p className="text-xs text-white/70 mb-5">Free to enlist. No credit card required.</p>
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
