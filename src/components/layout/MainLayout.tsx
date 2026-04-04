import React from 'react';
import { Navigation } from './Navigation';
import { Header } from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
}

export function MainLayout({ children, showHeader = true }: MainLayoutProps) {
    return (
        <div className="flex h-screen flex-col bg-[#050B08] text-white relative">
            {/* Global Background Elements for Lightweight Glassmorphic Feel */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-b from-[#102a1b]/40 to-transparent rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-gradient-to-t from-[#FFD60A]/5 to-transparent rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden relative z-10">
                {showHeader && <Header />}

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto pb-32">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Navigation */}
            <div className="z-50 relative pointer-events-none">
                <div className="pointer-events-auto">
                    <Navigation />
                </div>
            </div>
        </div>
    );
}
