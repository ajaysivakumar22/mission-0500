import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'Terms and Conditions for using Mission 0500 — rules, acceptable use policy, and legal disclaimers.',
};

export default function TermsPage() {
    const lastUpdated = 'March 7, 2026';

    return (
        <article>
            {/* Heading */}
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-[#FFD60A] font-semibold mb-3">Rules of Engagement</p>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Terms &amp; Conditions</h1>
                <p className="text-sm text-[#6B7280]">Last updated: {lastUpdated}</p>
            </div>

            <div className="space-y-10 text-[#9CA3AF] leading-relaxed">
                {/* Intro */}
                <section>
                    <p>
                        These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the Mission 0500 
                        web application and services (the &quot;Platform&quot;), operated by Mission 0500 (&quot;we&quot;, 
                        &quot;our&quot;, or &quot;us&quot;).
                    </p>
                    <p className="mt-3">
                        By creating an account or using the Platform, you agree to be bound by these Terms. If you do 
                        not agree, do not use the Platform.
                    </p>
                </section>

                {/* 1. Eligibility */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">1. Eligibility</h2>
                    <p>
                        You must be at least 13 years of age to use Mission 0500. If you are under 18, you must have 
                        the consent of a parent or legal guardian. By using the Platform, you represent and warrant 
                        that you meet these requirements.
                    </p>
                </section>

                {/* 2. Account */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">2. Account Registration</h2>
                    <p>To use the Platform, you must create an account by providing:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>A valid email address</li>
                        <li>Your full name</li>
                        <li>A secure password</li>
                    </ul>
                    <p className="mt-3">
                        You are responsible for maintaining the confidentiality of your account credentials and for 
                        all activities that occur under your account. Notify us immediately if you suspect unauthorised 
                        access to your account.
                    </p>
                </section>

                {/* 3. Services */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">3. Platform Services</h2>
                    <p>Mission 0500 provides the following services:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Daily routine tracking and habit building</li>
                        <li>Task management and completion tracking</li>
                        <li>Goal setting and progress logging</li>
                        <li>Daily performance reports with self-assessment ratings</li>
                        <li>Gamification through XP, ranks, medals, and streaks</li>
                        <li>Premium features via paid subscription (Elite Protocol)</li>
                    </ul>
                </section>

                {/* 4. Subscription & Payments */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">4. Subscription &amp; Payments</h2>
                    <div className="space-y-3">
                        <p>
                            Mission 0500 offers a free tier with core features and a premium subscription 
                            (&quot;Elite Protocol&quot;) at <strong className="text-white">₹399 per month</strong> that 
                            unlocks advanced features.
                        </p>
                        <p>
                            All payments are processed securely through <strong className="text-white">Razorpay</strong>. 
                            By subscribing, you agree to Razorpay&apos;s terms of service and privacy policy.
                        </p>
                        <p>
                            Subscription fees are billed monthly. You may cancel your subscription at any time from 
                            the Settings page. Cancellation takes effect at the end of the current billing period.
                        </p>
                        <p>
                            We reserve the right to change subscription pricing with reasonable notice. Existing 
                            subscribers will be notified before any price changes take effect.
                        </p>
                    </div>
                </section>

                {/* 5. Acceptable Use */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">5. Acceptable Use Policy</h2>
                    <p>You agree not to:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Use the Platform for any unlawful purpose</li>
                        <li>Attempt to gain unauthorised access to other user accounts or data</li>
                        <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
                        <li>Upload malicious code, viruses, or harmful content</li>
                        <li>Use automated tools (bots, scrapers) to access the Platform without authorisation</li>
                        <li>Impersonate another person or entity</li>
                        <li>Exploit the XP or gamification system through dishonest means</li>
                        <li>Use the Platform to harass, abuse, or harm others</li>
                    </ul>
                    <p className="mt-3">
                        Violation of this policy may result in immediate account suspension or termination at our 
                        sole discretion, without refund.
                    </p>
                </section>

                {/* 6. Intellectual Property */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">6. Intellectual Property</h2>
                    <p>
                        All content, features, design, code, trademarks, logos, and visual elements of Mission 0500 
                        are the intellectual property of Mission 0500 and are protected by applicable intellectual 
                        property laws.
                    </p>
                    <p className="mt-3">
                        You may not copy, reproduce, distribute, modify, or create derivative works from any part of 
                        the Platform without our express written permission.
                    </p>
                    <p className="mt-3">
                        Content you create on the Platform (routines, tasks, goals, reports) remains yours. We do not 
                        claim ownership of your user-generated content. However, you grant us a limited licence to 
                        store and process this content as necessary to provide the service.
                    </p>
                </section>

                {/* 7. Data Privacy */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">7. Data Privacy</h2>
                    <p>
                        Your use of the Platform is also governed by our{' '}
                        <a href="/privacy" className="text-[#FFD60A] hover:underline">Privacy Policy</a>, which 
                        explains how we collect, use, and protect your personal information.
                    </p>
                </section>

                {/* 8. Service Availability */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">8. Service Availability</h2>
                    <p>
                        We strive to keep Mission 0500 available at all times, but we do not guarantee uninterrupted, 
                        error-free, or secure access to the Platform. The service may be temporarily unavailable due to:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Scheduled maintenance or updates</li>
                        <li>Server outages or infrastructure issues</li>
                        <li>Force majeure events beyond our control</li>
                    </ul>
                    <p className="mt-3">
                        We shall not be liable for any loss or damage arising from service interruptions.
                    </p>
                </section>

                {/* 9. Limitation of Liability */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">9. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by applicable law, Mission 0500 and its operators, directors, 
                        employees, and affiliates shall not be liable for:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                        <li>Loss of data, profits, goodwill, or other intangible losses</li>
                        <li>Damages resulting from your use or inability to use the Platform</li>
                        <li>Damages resulting from unauthorised access to or alteration of your data</li>
                    </ul>
                    <p className="mt-3">
                        Our total liability for any claim arising out of these Terms shall not exceed the amount 
                        you have paid to us in the <strong className="text-white">12 months</strong> preceding the claim.
                    </p>
                </section>

                {/* 10. Disclaimer */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">10. Disclaimer of Warranties</h2>
                    <p>
                        The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without 
                        warranties of any kind, whether express or implied, including but not limited to implied 
                        warranties of merchantability, fitness for a particular purpose, and non-infringement.
                    </p>
                    <p className="mt-3">
                        Mission 0500 is a personal productivity tool and does not provide medical, psychological, 
                        or professional advice. Use the Platform at your own discretion.
                    </p>
                </section>

                {/* 11. Termination */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">11. Termination</h2>
                    <p>
                        We may suspend or terminate your account at any time if you violate these Terms or engage in 
                        conduct that we determine, in our sole discretion, to be harmful to the Platform or other users.
                    </p>
                    <p className="mt-3">
                        You may delete your account at any time by contacting us at{' '}
                        <a href="mailto:mission0500commandcentre@gmail.com" className="text-[#FFD60A] hover:underline">mission0500commandcentre@gmail.com</a>.
                        Upon termination, your right to use the Platform ceases immediately.
                    </p>
                </section>

                {/* 12. Governing Law */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">12. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of <strong className="text-white">India</strong>. 
                        Any disputes arising from these Terms or your use of the Platform shall be subject to the 
                        exclusive jurisdiction of the courts in India.
                    </p>
                </section>

                {/* 13. Changes */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">13. Changes to These Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time. Material changes will be communicated 
                        by updating the &quot;Last updated&quot; date. Your continued use of the Platform after changes 
                        are posted constitutes your acceptance of the revised Terms.
                    </p>
                </section>

                {/* Contact */}
                <section className="p-6 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">14. Contact</h2>
                    <p>
                        For questions about these Terms, contact us at:
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
