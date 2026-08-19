import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-textMain flex items-center justify-center p-4">
            <div className="card p-8 sm:p-12 text-center max-w-md w-full border-l-4 border-l-accent">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#20382B] text-[#D6A52C]">
                    <Shield className="h-7 w-7 fill-[#D6A52C]" />
                </div>

                <span className="font-mono-tech text-xs font-bold text-accent uppercase tracking-widest block mb-1">
                    404 · ROUTE UNCHARTED
                </span>

                <h1 className="text-2xl font-serif-quote font-bold text-textMain mb-2">
                    Objective Not Found
                </h1>

                <p className="text-xs text-textSecondary mb-6 leading-relaxed">
                    The requested coordinate does not exist or has been relocated. Return to your command center.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#D6A52C] text-[#20382B] font-bold py-3 rounded-xl hover:bg-[#c49526] transition text-xs uppercase tracking-wider shadow-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
