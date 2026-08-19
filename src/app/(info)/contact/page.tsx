import type { Metadata } from 'next';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the Mission 0500 team. Reach out for support, feedback, or any questions about our platform.',
};

export default function ContactPage() {
    return (
        <article className="space-y-8 animate-slide-in">
            {/* Heading */}
            <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-accent font-bold block mb-1">COMMUNICATIONS</span>
                <h1 className="text-3xl sm:text-4xl font-serif-quote font-bold text-textMain tracking-tight mb-3">Contact Us</h1>
                <p className="text-base text-textSecondary leading-relaxed max-w-2xl">
                    Have a question, feedback, or need support? Transmit a message to High Command.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="card p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center text-accent">
                        <Mail className="w-5 h-5" />
                    </div>
                    <h2 className="text-base font-bold text-textMain">Direct Email</h2>
                    <p className="text-xs text-textSecondary leading-relaxed">
                        For general inquiries, operational support, or partnership requests:
                    </p>
                    <a
                        href="mailto:mission0500commandcentre@gmail.com"
                        className="text-xs font-mono-tech font-bold text-accent hover:underline break-all block"
                    >
                        mission0500commandcentre@gmail.com
                    </a>
                </div>

                {/* Feedback */}
                <div className="card p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center text-accent">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <h2 className="text-base font-bold text-textMain">In-App Transmission</h2>
                    <p className="text-xs text-textSecondary leading-relaxed">
                        Enrolled operators can transmit feedback directly from the platform Settings under the &quot;Feedback&quot; tab.
                    </p>
                </div>
            </div>

            {/* Response Time */}
            <section className="card p-6 border-l-4 border-l-[#20382B]">
                <h2 className="text-base font-bold text-textMain mb-2">Response Window</h2>
                <p className="text-xs text-textSecondary leading-relaxed">
                    Commands aim to acknowledge all communications within <strong className="text-textMain">24–48 business hours</strong>. For urgent account or payment issues, please include &quot;URGENT&quot; in your message title.
                </p>
            </section>
        </article>
    );
}
