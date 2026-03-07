import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Refund & Cancellation Policy',
    description: 'Refund and Cancellation Policy for Mission 0500 — eligibility, timelines, and conditions for refunds on premium subscriptions.',
};

export default function RefundPolicyPage() {
    const lastUpdated = 'March 7, 2026';

    return (
        <article>
            {/* Heading */}
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-[#FFD60A] font-semibold mb-3">Financial Protocol</p>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Refund &amp; Cancellation Policy</h1>
                <p className="text-sm text-[#6B7280]">Last updated: {lastUpdated}</p>
            </div>

            <div className="space-y-10 text-[#9CA3AF] leading-relaxed">
                {/* Intro */}
                <section>
                    <p>
                        This Refund and Cancellation Policy applies to all paid subscriptions on Mission 0500 
                        (&quot;the Platform&quot;). Please read this policy carefully before purchasing a subscription.
                    </p>
                </section>

                {/* 1. Subscription Overview */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">1. Subscription Overview</h2>
                    <div className="p-5 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[#6B7280] uppercase text-xs tracking-wider mb-1">Plan</p>
                                <p className="text-white font-semibold">Elite Protocol</p>
                            </div>
                            <div>
                                <p className="text-[#6B7280] uppercase text-xs tracking-wider mb-1">Price</p>
                                <p className="text-white font-semibold">₹399 / month</p>
                            </div>
                            <div>
                                <p className="text-[#6B7280] uppercase text-xs tracking-wider mb-1">Billing Cycle</p>
                                <p className="text-white font-semibold">Monthly (recurring)</p>
                            </div>
                            <div>
                                <p className="text-[#6B7280] uppercase text-xs tracking-wider mb-1">Payment Gateway</p>
                                <p className="text-white font-semibold">Razorpay</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Cancellation */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">2. Cancellation Policy</h2>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            You may cancel your Elite Protocol subscription at any time from the 
                            <strong className="text-white"> Settings</strong> page within the Platform.
                        </li>
                        <li>
                            Upon cancellation, your premium features will remain active until the 
                            <strong className="text-white"> end of the current billing period</strong>.
                        </li>
                        <li>
                            After the billing period ends, your account will revert to the free tier. 
                            No further charges will be made.
                        </li>
                        <li>
                            Cancellation does not result in deletion of your account or data. Your 
                            routines, tasks, goals, reports, and progress are retained.
                        </li>
                    </ul>
                </section>

                {/* 3. Refund Eligibility */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">3. Refund Eligibility</h2>
                    <p>Refunds may be granted under the following conditions:</p>
                    
                    <div className="mt-4 space-y-3">
                        <div className="p-4 rounded-lg bg-[#162B20] border border-[#1E3A2A]">
                            <p className="text-white font-semibold text-sm mb-1">Within 7 days of first subscription</p>
                            <p className="text-sm">If you subscribed for the first time and are unsatisfied, you may request a full refund within 7 days of your initial payment, provided you have not extensively used the premium features.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#162B20] border border-[#1E3A2A]">
                            <p className="text-white font-semibold text-sm mb-1">Duplicate or erroneous charges</p>
                            <p className="text-sm">If you were charged multiple times for the same billing period due to a technical error, we will refund the duplicate amount.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#162B20] border border-[#1E3A2A]">
                            <p className="text-white font-semibold text-sm mb-1">Service unavailability</p>
                            <p className="text-sm">If the Platform is unavailable for an extended period (more than 72 consecutive hours) due to issues on our end, you may request a prorated refund for the affected period.</p>
                        </div>
                    </div>
                </section>

                {/* 4. Non-Refundable */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">4. Conditions Where Refunds May Be Denied</h2>
                    <p>Refunds will generally <strong className="text-white">not</strong> be provided in the following cases:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Change of mind after the 7-day initial window</li>
                        <li>Failure to cancel before the next billing cycle</li>
                        <li>Dissatisfaction with features that are clearly described on the Platform</li>
                        <li>Account suspension or termination due to violation of our Terms &amp; Conditions</li>
                        <li>Partial month usage — we do not provide prorated refunds for partial billing periods except in cases of service unavailability</li>
                    </ul>
                </section>

                {/* 5. How to Request */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">5. How to Request a Refund</h2>
                    <p>To request a refund, email us at:</p>
                    <p className="mt-3">
                        <a href="mailto:mission0500commandcentre@gmail.com" className="text-[#FFD60A] font-semibold hover:underline">mission0500commandcentre@gmail.com</a>
                    </p>
                    <p className="mt-3">Please include the following in your email:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Your registered email address</li>
                        <li>Date of payment</li>
                        <li>Reason for the refund request</li>
                        <li>Razorpay payment ID or transaction reference (if available)</li>
                    </ul>
                </section>

                {/* 6. Refund Timeline */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">6. Refund Processing Timeline</h2>
                    <div className="p-5 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center border-b border-[#1E3A2A] pb-3">
                                <span className="text-[#9CA3AF]">Refund request review</span>
                                <span className="text-white font-semibold">3–5 business days</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#1E3A2A] pb-3">
                                <span className="text-[#9CA3AF]">Refund initiated via Razorpay</span>
                                <span className="text-white font-semibold">1–2 business days after approval</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#9CA3AF]">Amount credited to your account</span>
                                <span className="text-white font-semibold">5–10 business days (bank dependent)</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-sm">
                        Refund timelines may vary depending on your bank or payment method. Razorpay processes 
                        refunds as per their standard procedures.
                    </p>
                </section>

                {/* 7. Changes */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">7. Changes to This Policy</h2>
                    <p>
                        We reserve the right to update this policy at any time. Changes will be reflected by updating 
                        the &quot;Last updated&quot; date. Continued use of paid services after changes constitutes 
                        acceptance of the revised policy.
                    </p>
                </section>

                {/* Contact */}
                <section className="p-6 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">Contact Us</h2>
                    <p>
                        For any questions regarding refunds or cancellations, reach out to us at:
                    </p>
                    <p className="mt-3">
                        <strong className="text-white">Email:</strong>{' '}
                        <a href="mailto:mission0500commandcentre@gmail.com" className="text-[#FFD60A] hover:underline">mission0500commandcentre@gmail.com</a>
                    </p>
                </section>
            </div>
        </article>
    );
}
