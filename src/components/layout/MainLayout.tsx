import React from 'react';
import { Navigation } from './Navigation';
import { Header } from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
}

/**
 * MainLayout — Application Shell
 * 
 * Desktop (lg+):
 *   Left sidebar (240px) + Main content area (flex-1)
 *   Header hidden — sidebar provides brand presence
 * 
 * Mobile (<lg):
 *   Full width content
 *   Thin header at top
 *   Bottom island navigation
 */
export function MainLayout({ children, showHeader = true }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen bg-background text-textMain">
            {/* Desktop Sidebar is rendered inside Navigation */}
            <Navigation />

            {/* Content Column */}
            <div className="flex flex-1 flex-col min-w-0">
                {/* Slim Header — only visible on mobile */}
                <div className="lg:hidden">
                    {showHeader && <Header />}
                </div>

                {/* Main Content */}
                <main className="flex-1 pb-24 lg:pb-8 pt-2">
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 transition-all duration-300">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
