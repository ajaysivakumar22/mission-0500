import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Target, BarChart3, Zap, Trophy, Shield, Star, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Services',
    description: 'Explore Mission 0500 services — daily routines, goal tracking, performance reports, XP system, medals, and premium features.',
};

export default function ServicesPage() {
    return (
        <article>
            {/* Heading */}
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-[#FFD60A] font-semibold mb-3">Operations Manual</p>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Our Services</h1>
                <p className="text-lg text-[#9CA3AF] leading-relaxed max-w-2xl">
                    Mission 0500 is a personal discipline command center. Here&apos;s everything you get access to.
                </p>
            </div>

            {/* How it works */}
            <section className="mb-14">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-6">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { step: '01', title: 'Enlist', desc: 'Create a free account, choose your archetype (Operator, Scholar, Builder, or Athlete), and set your primary directive.' },
                        { step: '02', title: 'Execute', desc: 'Complete daily routines, manage tasks, log reports, and track goals. Every action earns XP toward your next rank.' },
                        { step: '03', title: 'Dominate', desc: 'Build streaks, unlock medals, climb from Cadet to Commander, and achieve total accountability over your daily execution.' },
                    ].map((s) => (
                        <div key={s.step} className="p-5 rounded-xl bg-[#162B20] border border-[#1E3A2A] text-center">
                            <div className="text-4xl font-black text-[#FFD60A]/20 mb-2">{s.step}</div>
                            <h3 className="text-lg font-bold text-white uppercase mb-2">{s.title}</h3>
                            <p className="text-sm text-[#9CA3AF]">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Free tier features */}
            <section className="mb-14">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">Free Tier — Phase 1 Authorisation</h2>
                <p className="text-[#9CA3AF] mb-6">Everything you need to start building discipline. No credit card required.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            icon: Clock,
                            title: 'Daily Routines',
                            desc: 'Create and track daily routines. Choose from 4 archetype-based templates (Operator, Scholar, Builder, Athlete) or build your own. Mark items complete each day.',
                        },
                        {
                            icon: Target,
                            title: 'Goal Tracking',
                            desc: 'Set short-term and long-term goals. Log progress entries with notes. Monitor completion percentage and momentum.',
                        },
                        {
                            icon: BarChart3,
                            title: 'Daily Reports',
                            desc: 'Submit daily after-action reports with self-assessed mood, energy, and discipline ratings. Write notes to reflect on your day.',
                        },
                        {
                            icon: Zap,
                            title: 'XP & Rank System',
                            desc: 'Earn XP for completing routines, tasks, and reports. Progress through military ranks: Cadet → Senior Cadet → Officer → Commander.',
                        },
                        {
                            icon: Trophy,
                            title: 'Medals & Streaks',
                            desc: 'Unlock achievement medals for milestones like 7-day streaks, 100 tasks completed, and more. Track your execution streak.',
                        },
                        {
                            icon: Star,
                            title: 'Task Management',
                            desc: 'Create, prioritise, and manage daily tasks. Mark them complete and earn XP. Organise by priority level (low, medium, high, critical).',
                        },
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

            {/* Premium tier */}
            <section className="mb-14">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">Elite Protocol — ₹399/month</h2>
                <p className="text-[#9CA3AF] mb-6">Unlock the full arsenal for maximum accountability and performance insights.</p>

                <div className="p-6 rounded-xl bg-[#162B20] border border-[#FFD60A]/30">
                    <div className="flex items-center gap-2 mb-5">
                        <Shield className="w-5 h-5 text-[#FFD60A]" />
                        <span className="text-[#FFD60A] font-bold uppercase tracking-wider text-sm">Premium Features</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                title: 'Strategic Goals Board',
                                desc: 'Access yearly goal planning with advanced progress visualisation and milestone tracking.',
                            },
                            {
                                title: 'Deep Telemetry',
                                desc: 'Unlock historical data analytics and AI-powered performance forecasting. See trends across weeks and months.',
                            },
                            {
                                title: 'Unlimited Flow',
                                desc: 'Calendar sync integration and unlimited task/routine capacity for power users.',
                            },
                            {
                                title: 'Strict Accountability Mode',
                                desc: 'Enable XP penalties for missed routines and tasks. No excuses — this mode enforces real consequences for inaction.',
                            },
                        ].map((f) => (
                            <div key={f.title} className="flex items-start gap-3 p-4 rounded-lg bg-[#0B1D13]/50 border border-[#1E3A2A]">
                                <div className="w-2 h-2 rounded-full bg-[#FFD60A] mt-1.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                                    <p className="text-sm text-[#9CA3AF] leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#1E3A2A]">
                        <p className="text-xs text-[#6B7280]">
                            Payments processed securely via Razorpay. Cancel anytime from Settings. See our{' '}
                            <a href="/refund" className="text-[#FFD60A] hover:underline">Refund Policy</a> for details.
                        </p>
                    </div>
                </div>
            </section>

            {/* What you get after payment */}
            <section className="mb-14">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">What You Receive After Payment</h2>
                <div className="p-5 rounded-xl bg-[#162B20] border border-[#1E3A2A] space-y-3 text-sm text-[#9CA3AF]">
                    <p>Upon successful payment of the Elite Protocol subscription:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Your account is <strong className="text-white">instantly upgraded</strong> to Elite Protocol status</li>
                        <li>All premium features are <strong className="text-white">unlocked immediately</strong></li>
                        <li>Your subscription status is visible in the <strong className="text-white">Settings</strong> page</li>
                        <li>A payment confirmation is sent to your registered email by Razorpay</li>
                        <li>Your subscription <strong className="text-white">renews automatically</strong> each month until cancelled</li>
                    </ul>
                    <p className="mt-4">
                        This is a <strong className="text-white">digital service subscription</strong>. No physical goods are shipped. 
                        Access is granted through the web application at the time of payment.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center p-8 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-3">Start Your Mission</h2>
                <p className="text-[#9CA3AF] mb-6">Sign up free. Upgrade when you&apos;re ready for the next level.</p>
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
