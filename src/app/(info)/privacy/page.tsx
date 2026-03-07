import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for Mission 0500 — how we collect, use, and protect your personal data.',
};

export default function PrivacyPolicyPage() {
    const lastUpdated = 'March 7, 2026';

    return (
        <article>
            {/* Heading */}
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-[#FFD60A] font-semibold mb-3">Classified Document</p>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Privacy Policy</h1>
                <p className="text-sm text-[#6B7280]">Last updated: {lastUpdated}</p>
            </div>

            <div className="space-y-10 text-[#9CA3AF] leading-relaxed">
                {/* Intro */}
                <section>
                    <p>
                        Mission 0500 (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting 
                        your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                        information when you use our web application and services (collectively, the &quot;Platform&quot;).
                    </p>
                    <p className="mt-3">
                        By accessing or using Mission 0500, you agree to this Privacy Policy. If you do not agree, 
                        please do not use the Platform.
                    </p>
                </section>

                {/* 1. Information We Collect */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">1. Information We Collect</h2>
                    
                    <h3 className="text-base font-semibold text-white mb-2 mt-4">1.1 Personal Information</h3>
                    <p>When you create an account, we collect:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Password (stored in encrypted form)</li>
                    </ul>

                    <h3 className="text-base font-semibold text-white mb-2 mt-4">1.2 Usage Data</h3>
                    <p>As you use the Platform, we collect data related to your activity, including:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Daily routines and task completions</li>
                        <li>Goals and goal progress logs</li>
                        <li>Daily reports (mood, energy, discipline ratings, notes)</li>
                        <li>XP (experience points), rank, and streak data</li>
                        <li>Theme and settings preferences</li>
                        <li>Timezone (detected automatically for scheduling)</li>
                    </ul>

                    <h3 className="text-base font-semibold text-white mb-2 mt-4">1.3 Payment Information</h3>
                    <p>
                        If you subscribe to our premium plan (Elite Protocol), payments are processed through 
                        <strong className="text-white"> Razorpay</strong>, a third-party payment gateway. We do 
                        <strong className="text-white"> not</strong> store your credit card numbers, debit card 
                        numbers, or banking details on our servers. Razorpay handles all payment data in compliance 
                        with PCI-DSS standards. We only store your subscription status, plan tier, and payment 
                        reference identifiers.
                    </p>

                    <h3 className="text-base font-semibold text-white mb-2 mt-4">1.4 Automatically Collected Information</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Browser type and version</li>
                        <li>Device type</li>
                        <li>IP address (for security and analytics)</li>
                        <li>Pages visited and interactions within the Platform</li>
                    </ul>
                </section>

                {/* 2. How We Use Your Information */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Provide, operate, and maintain the Platform</li>
                        <li>Track your routines, tasks, goals, and progress</li>
                        <li>Calculate XP, ranks, streaks, and medals</li>
                        <li>Generate performance reports and analytics</li>
                        <li>Process subscription payments via Razorpay</li>
                        <li>Send service-related notifications and updates</li>
                        <li>Improve and personalise the user experience</li>
                        <li>Monitor for errors and technical issues (via Sentry)</li>
                        <li>Ensure security and prevent fraud</li>
                    </ul>
                </section>

                {/* 3. Cookies and Tracking */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">3. Cookies and Tracking</h2>
                    <p>We use the following cookies and similar technologies:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li><strong className="text-white">Authentication cookies</strong> — to keep you logged in securely across sessions</li>
                        <li><strong className="text-white">Preference cookies</strong> — to remember your theme and settings</li>
                        <li><strong className="text-white">Role cookie</strong> — to route admin users appropriately</li>
                    </ul>
                    <p className="mt-3">
                        We do not use third-party advertising or marketing cookies. We use Sentry for error 
                        monitoring in production, which may collect anonymised diagnostic data.
                    </p>
                </section>

                {/* 4. Third-Party Services */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">4. Third-Party Services</h2>
                    <p>We use the following third-party services:</p>
                    <div className="mt-3 space-y-3">
                        <div className="p-4 rounded-lg bg-[#162B20] border border-[#1E3A2A]">
                            <p className="text-white font-semibold text-sm">Supabase (Authentication &amp; Database)</p>
                            <p className="text-sm mt-1">Provides user authentication and secure data storage. Data is hosted on Supabase&apos;s cloud infrastructure.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#162B20] border border-[#1E3A2A]">
                            <p className="text-white font-semibold text-sm">Razorpay (Payment Processing)</p>
                            <p className="text-sm mt-1">Processes subscription payments securely. Razorpay is PCI-DSS compliant. Their privacy policy applies to payment data they process.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#162B20] border border-[#1E3A2A]">
                            <p className="text-white font-semibold text-sm">Sentry (Error Monitoring)</p>
                            <p className="text-sm mt-1">Captures application errors for debugging. Collects anonymised technical data only in production environment.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#162B20] border border-[#1E3A2A]">
                            <p className="text-white font-semibold text-sm">Vercel (Hosting)</p>
                            <p className="text-sm mt-1">Hosts and serves the web application. Standard server logs may be collected.</p>
                        </div>
                    </div>
                </section>

                {/* 5. Data Protection */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">5. Data Protection</h2>
                    <p>We implement appropriate technical and organisational measures to protect your data, including:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Encrypted passwords (never stored in plain text)</li>
                        <li>Secure authentication with JWT tokens and HTTP-only cookies</li>
                        <li>Server-side input sanitisation to prevent injection attacks</li>
                        <li>Auth guards on all server actions to prevent unauthorised access</li>
                        <li>HTTPS encryption for all data in transit</li>
                        <li>Row-level data isolation — users can only access their own data</li>
                    </ul>
                </section>

                {/* 6. Data Retention */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">6. Data Retention</h2>
                    <p>
                        We retain your personal data for as long as your account is active or as needed to provide 
                        you with our services. If you wish to delete your account and associated data, please contact 
                        us at <a href="mailto:mission0500commandcentre@gmail.com" className="text-[#FFD60A] hover:underline">mission0500commandcentre@gmail.com</a>.
                    </p>
                </section>

                {/* 7. Your Rights */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Access the personal data we hold about you</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your account and data</li>
                        <li>Withdraw consent for data processing (which may limit Platform functionality)</li>
                        <li>Request a copy of your data in a portable format</li>
                    </ul>
                    <p className="mt-3">
                        To exercise any of these rights, contact us at{' '}
                        <a href="mailto:mission0500commandcentre@gmail.com" className="text-[#FFD60A] hover:underline">mission0500commandcentre@gmail.com</a>.
                    </p>
                </section>

                {/* 8. Children's Privacy */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">8. Children&apos;s Privacy</h2>
                    <p>
                        Mission 0500 is not intended for children under the age of 13. We do not knowingly collect 
                        personal information from children. If you believe a child has provided us with personal data, 
                        please contact us and we will delete it.
                    </p>
                </section>

                {/* 9. Changes */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">9. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify users of material changes 
                        by updating the &quot;Last updated&quot; date at the top of this page. Your continued use of 
                        the Platform after changes constitutes acceptance of the updated policy.
                    </p>
                </section>

                {/* 10. Contact */}
                <section className="p-6 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-3">10. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
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
