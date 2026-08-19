import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'Terms and Conditions for using Mission 0500 — rules, acceptable use policy, and legal disclaimers.',
};

export default function TermsPage() {
    const lastUpdated = 'March 7, 2026';

    return (
        <article className="space-y-8 animate-slide-in">
            {/* Heading */}
            <div className="border-b border-border pb-4">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-accent font-bold block mb-1">RULES OF ENGAGEMENT</span>
                <h1 className="text-3xl sm:text-4xl font-serif-quote font-bold text-textMain tracking-tight mb-1">Terms &amp; Conditions</h1>
                <p className="text-xs text-textMuted font-mono-tech">Last updated: {lastUpdated}</p>
            </div>

            <div className="space-y-8 text-xs text-textSecondary leading-relaxed">
                <section className="card p-6 space-y-2">
                    <p>
                        These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the Mission 0500 web application and services (the &quot;Platform&quot;).
                    </p>
                    <p>
                        By creating an account or using the Platform, you agree to be bound by these Terms.
                    </p>
                </section>

                <section className="card p-6 space-y-3">
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">1. Platform Services &amp; Subscriptions</h2>
                    <p>
                        Mission 0500 provides a free tier with core daily routines, tasks, and reports, along with a premium subscription (&quot;Elite Protocol&quot;) at <strong className="text-textMain">₹100 per month</strong>.
                    </p>
                    <p>
                        Subscription payments are processed securely through <strong className="text-textMain">Razorpay</strong>. You may cancel your subscription at any time from Settings.
                    </p>
                </section>

                <section className="card p-6 space-y-3">
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">2. Acceptable Use Policy</h2>
                    <p>You agree not to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-3 text-textMuted">
                        <li>Use the Platform for any unlawful purpose</li>
                        <li>Attempt to gain unauthorized access to other user data</li>
                        <li>Automate access with scraping bots or unauthorized tools</li>
                        <li>Exploit gamification XP systems dishonestly</li>
                    </ul>
                </section>

                <section className="card p-6 border-l-4 border-l-accent space-y-2">
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">3. Contact &amp; Legal Notices</h2>
                    <p>For legal inquiries, contact High Command at:</p>
                    <a href="mailto:mission0500commandcentre@gmail.com" className="font-mono-tech font-bold text-accent hover:underline block">
                        mission0500commandcentre@gmail.com
                    </a>
                </section>
            </div>
        </article>
    );
}
