import type { Metadata } from 'next';
import Link from 'next/link';
import { Crosshair } from 'lucide-react';

export const metadata: Metadata = {
    title: {
        template: '%s | MISSION 0500',
        default: 'MISSION 0500',
    },
};

export default function InfoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0B1D13] text-[#E8E8E8]">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-[#0B1D13]/90 backdrop-blur-md border-b border-[#1E3A2A]">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <Crosshair className="w-6 h-6 text-[#FFD60A]" />
                        <span className="text-lg font-black uppercase tracking-wider text-white">Mission 0500</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-bold bg-[#FFD60A] text-[#0B1D13] px-5 py-2 rounded-lg hover:bg-[#e6c209] transition uppercase tracking-wide"
                        >
                            Enlist Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#1E3A2A] bg-[#0d2317]">
                <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD60A] mb-4">Platform</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-sm text-[#9CA3AF] hover:text-white transition">About</Link></li>
                                <li><Link href="/services" className="text-sm text-[#9CA3AF] hover:text-white transition">Services</Link></li>
                                <li><Link href="/contact" className="text-sm text-[#9CA3AF] hover:text-white transition">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD60A] mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><Link href="/privacy" className="text-sm text-[#9CA3AF] hover:text-white transition">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="text-sm text-[#9CA3AF] hover:text-white transition">Terms &amp; Conditions</Link></li>
                                <li><Link href="/refund" className="text-sm text-[#9CA3AF] hover:text-white transition">Refund Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD60A] mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><Link href="/login" className="text-sm text-[#9CA3AF] hover:text-white transition">Sign In</Link></li>
                                <li><Link href="/login" className="text-sm text-[#9CA3AF] hover:text-white transition">Enlist Now</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD60A] mb-4">Contact</h4>
                            <p className="text-sm text-[#9CA3AF] break-all">mission0500commandcentre@gmail.com</p>
                        </div>
                    </div>
                    <div className="border-t border-[#1E3A2A] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Crosshair className="w-4 h-4 text-[#FFD60A]" />
                            <span className="text-sm font-bold uppercase tracking-wider text-[#6B7280]">Mission 0500</span>
                        </div>
                        <p className="text-xs text-[#4B5563]">&copy; {new Date().getFullYear()} Mission 0500. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
