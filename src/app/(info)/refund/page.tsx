import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Refund & Cancellation Policy',
    description: 'Refund and Cancellation Policy for Mission 0500 — eligibility, timelines, and conditions for refunds on premium subscriptions.',
};

export default function RefundPolicyPage() {
    const lastUpdated = 'March 7, 2026';

    return (
        <article className="space-y-8 animate-slide-in">
            {/* Heading */}
            <div className="border-b border-border pb-4">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-accent font-bold block mb-1">FINANCIAL PROTOCOL</span>
                <h1 className="text-3xl sm:text-4xl font-serif-quote font-bold text-textMain tracking-tight mb-1">Refund &amp; Cancellation Policy</h1>
                <p className="text-xs text-textMuted font-mono-tech">Last updated: {lastUpdated}</p>
            </div>

            <div className="space-y-8 text-xs text-textSecondary leading-relaxed">
                <section className="card p-6 space-y-3">
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">1. Subscription Overview</h2>
                    <div className="card-muted p-4 space-y-2 font-mono-tech">
                        <div className="flex justify-between">
                            <span className="text-textMuted">Tier:</span>
                            <span className="font-bold text-textMain">Elite Protocol</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-textMuted">Price:</span>
                            <span className="font-bold text-accent">₹100 / month</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-textMuted">Billing:</span>
                            <span className="font-bold text-textMain">Monthly recurring</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-textMuted">Gateway:</span>
                            <span className="font-bold text-textMain">Razorpay PCI-DSS</span>
                        </div>
                    </div>
                </section>

                <section className="card p-6 space-y-3">
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">2. Cancellation &amp; Refund Window</h2>
                    <p>
                        You may cancel your subscription at any time from Settings. Features remain active until the end of the billing period. Full refund requests within 7 days of initial subscription are reviewed upon email request.
                    </p>
                </section>

                <section className="card p-6 border-l-4 border-l-accent space-y-2">
                    <h2 className="text-base font-bold text-textMain uppercase tracking-wide">3. Contact Refund Support</h2>
                    <p>Transmit refund inquiries with payment ID to:</p>
                    <a href="mailto:mission0500commandcentre@gmail.com" className="font-mono-tech font-bold text-accent hover:underline block">
                        mission0500commandcentre@gmail.com
                    </a>
                </section>
            </div>
        </article>
    );
}
