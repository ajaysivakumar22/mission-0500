import type { Metadata } from 'next';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the Mission 0500 team. Reach out for support, feedback, or any questions about our platform.',
};

export default function ContactPage() {
    return (
        <article>
            {/* Heading */}
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-[#FFD60A] font-semibold mb-3">Communications</p>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Contact Us</h1>
                <p className="text-lg text-[#9CA3AF] leading-relaxed max-w-2xl">
                    Have a question, feedback, or need support? Reach out to us and we&apos;ll get back to you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email */}
                <div className="p-6 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                    <div className="w-10 h-10 rounded-lg bg-[#0B1D13] border border-[#1E3A2A] flex items-center justify-center mb-4">
                        <Mail className="w-5 h-5 text-[#FFD60A]" />
                    </div>
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Email</h2>
                    <p className="text-sm text-[#9CA3AF] mb-4">
                        For general enquiries, support, or partnership requests, email us at:
                    </p>
                    <a
                        href="mailto:mission0500commandcentre@gmail.com"
                        className="text-[#FFD60A] font-semibold text-sm hover:underline break-all"
                    >
                        mission0500commandcentre@gmail.com
                    </a>
                </div>

                {/* Feedback */}
                <div className="p-6 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                    <div className="w-10 h-10 rounded-lg bg-[#0B1D13] border border-[#1E3A2A] flex items-center justify-center mb-4">
                        <MessageSquare className="w-5 h-5 text-[#FFD60A]" />
                    </div>
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-2">In-App Feedback</h2>
                    <p className="text-sm text-[#9CA3AF] mb-4">
                        Logged-in users can submit feedback directly from the platform using the feedback form 
                        available in the Settings page under &quot;Feedback&quot;.
                    </p>
                    <p className="text-xs text-[#6B7280]">
                        We review all feedback and use it to improve the platform.
                    </p>
                </div>
            </div>

            {/* Response time */}
            <section className="mt-12 p-6 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-3">Response Time</h2>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    We aim to respond to all queries within <span className="text-white font-semibold">24–48 business hours</span>. 
                    For urgent matters related to payments or account access, please include &quot;URGENT&quot; in your 
                    email subject line.
                </p>
            </section>

            {/* Mailing address */}
            <section className="mt-8 p-6 rounded-xl bg-[#162B20] border border-[#1E3A2A]">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-3">Registered Address</h2>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    Mission 0500<br />
                    India<br />
                    Email: mission0500commandcentre@gmail.com
                </p>
            </section>
        </article>
    );
}
