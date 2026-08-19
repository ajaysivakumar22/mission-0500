import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for Mission 0500 — how we collect, use, and protect your personal data.',
};

export default function PrivacyPolicyPage() {
    const lastUpdated = 'March 7, 2026';

    return (
        <article className="space-y-8 animate-slide-in">
            {/* Heading */}
            <div className="border-b border-border pb-4">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-accent font-bold block mb-1">CLASSIFIED DOCUMENT</span>
                <h1 className="text-3xl sm:text-4xl font-serif-quote font-bold text-textMain tracking-tight mb-1">Privacy Policy</h1>
                <p className="text-xs text-textMuted font-mono-tech">Last updated: {lastUpdated}</p>
            </div>

            <div className="space-y-8 text-xs text-textSecondary leading-relaxed">
                {/* Intro */}
                <section className="card p-6 space-y-2">
                    <p>
                        Mission 0500 (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application and services.
                    </p>
                    <p>
                        By accessing or using Mission 0500, you agree to this Privacy Policy.
                    </p>
                </section>

                {/* 1. Information We Collect */}
                <section className="card p-6 space-y-3">
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">1. Information We Collect</h2>

                    <div>
                        <h3 className="font-bold text-textMain mb-1">1.1 Personal Information</h3>
                        <ul className="list-disc list-inside space-y-1 ml-3 text-textMuted">
                            <li>Full name</li>
                            <li>Email address</li>
                            <li>Password (stored in encrypted form)</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-textMain mb-1">1.2 Usage Telemetry</h3>
                        <ul className="list-disc list-inside space-y-1 ml-3 text-textMuted">
                            <li>Daily routines and task completions</li>
                            <li>Goals and campaign progress logs</li>
                            <li>Daily debrief reports (energy, discipline ratings, notes)</li>
                            <li>XP, rank, and streak data</li>
                            <li>Theme and operating profile preferences</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-textMain mb-1">1.3 Payment Information</h3>
                        <p>
                            Subscription payments are processed securely through <strong className="text-textMain">Razorpay</strong>. We do not store your raw credit card numbers or banking details. Razorpay handles all payment data in compliance with PCI-DSS standards.
                        </p>
                    </div>
                </section>

                {/* 2. Third-Party Infrastructure */}
                <section className="card p-6 space-y-3">
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">2. Third-Party Infrastructure</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="card-muted p-3.5 space-y-1">
                            <span className="font-bold text-textMain block">Supabase</span>
                            <p className="text-textMuted">Authentication and cloud database hosting.</p>
                        </div>
                        <div className="card-muted p-3.5 space-y-1">
                            <span className="font-bold text-textMain block">Razorpay</span>
                            <p className="text-textMuted">PCI-DSS compliant payment gateway.</p>
                        </div>
                        <div className="card-muted p-3.5 space-y-1">
                            <span className="font-bold text-textMain block">Vercel</span>
                            <p className="text-textMuted">Web application hosting infrastructure.</p>
                        </div>
                        <div className="card-muted p-3.5 space-y-1">
                            <span className="font-bold text-textMain block">Sentry</span>
                            <p className="text-textMuted">Production error monitoring.</p>
                        </div>
                    </div>
                </section>

                {/* 3. Contact & Inquiries */}
                <section className="card p-6 border-l-4 border-l-accent space-y-2">
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">3. Privacy Contact</h2>
                    <p>
                        For inquiries, data access requests, or account deletion, contact High Command at:
                    </p>
                    <a href="mailto:mission0500commandcentre@gmail.com" className="font-mono-tech font-bold text-accent hover:underline block">
                        mission0500commandcentre@gmail.com
                    </a>
                </section>
            </div>
        </article>
    );
}
