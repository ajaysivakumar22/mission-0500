import React from 'react';
import { Navigation } from './Navigation';
import { Header } from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
}

export function MainLayout({ children, showHeader = true }: MainLayoutProps) {
    return (
        <div className="flex h-screen flex-col bg-[#051009] text-[#E8E8E8] relative">
            {/* Global Background Elements for Military Premium Feel */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B4332]/20 via-transparent to-transparent opacity-60 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#051009] via-transparent to-transparent opacity-90"></div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden relative z-10">
                {showHeader && <Header />}

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto pb-32">
                    {/* Removed max-w-7xl to fill screen completely as requested */}
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Navigation - Moved after main content with higher z-index to ensure clicks work! */}
            <div className="z-50 relative pointer-events-none">
                <div className="pointer-events-auto">
                    <Navigation />
                </div>
            </div>
        </div>
    );
}
