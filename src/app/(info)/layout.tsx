import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: {
        template: '%s | MISSION 0500',
        default: 'MISSION 0500',
    },
};

export default function InfoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-textMain flex flex-col justify-between">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#20382B] text-[#D6A52C]">
                            <Shield className="h-4 w-4 fill-[#D6A52C]" />
                        </div>
                        <div>
                            <span className="font-mono-tech text-[10px] text-accent uppercase tracking-widest block leading-none">MISSION</span>
                            <span className="text-base font-black text-textMain tracking-wider block">0500</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-xs font-bold bg-[#D6A52C] text-[#20382B] px-4 py-2 rounded-xl hover:bg-[#c49526] transition shadow-sm uppercase tracking-wide"
                        >
                            Enlist Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 flex-1 w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-surface py-10 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
                        <div>
                            <span className="font-mono-tech text-accent uppercase font-bold tracking-widest block mb-3">Platform</span>
                            <ul className="space-y-2 text-textSecondary font-medium">
                                <li><Link href="/about" className="hover:text-textMain transition">About</Link></li>
                                <li><Link href="/services" className="hover:text-textMain transition">Services</Link></li>
                                <li><Link href="/contact" className="hover:text-textMain transition">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-mono-tech text-accent uppercase font-bold tracking-widest block mb-3">Legal</span>
                            <ul className="space-y-2 text-textSecondary font-medium">
                                <li><Link href="/privacy" className="hover:text-textMain transition">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-textMain transition">Terms &amp; Conditions</Link></li>
                                <li><Link href="/refund" className="hover:text-textMain transition">Refund Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-mono-tech text-accent uppercase font-bold tracking-widest block mb-3">Product</span>
                            <ul className="space-y-2 text-textSecondary font-medium">
                                <li><Link href="/login" className="hover:text-textMain transition">Sign In</Link></li>
                                <li><Link href="/login" className="hover:text-textMain transition">Enlist Now</Link></li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-mono-tech text-accent uppercase font-bold tracking-widest block mb-3">Contact</span>
                            <p className="text-textSecondary break-all font-mono-tech">mission0500commandcentre@gmail.com</p>
                        </div>
                    </div>
                    <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-textMuted font-mono-tech">
                        <span>MISSION 0500 · PERSONAL DISCIPLINE OPERATING SYSTEM</span>
                        <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
