import React from 'react';
import { Navigation } from './Navigation';
import { Header } from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
}

export function MainLayout({ children, showHeader = true }: MainLayoutProps) {
    return (
        <div className="flex h-screen flex-col bg-[#0B1D13] text-[#E8E8E8] lg:flex-row">
            {/* Navigation */}
            <Navigation />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {showHeader && <Header />}

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                    <div className="mx-auto max-w-7xl px-4 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
