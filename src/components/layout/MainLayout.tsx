import React from 'react';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { PageTransition } from './PageTransition';

interface MainLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    disableTransitionLine?: boolean;
}

/**
 * MainLayout — Application Shell
 * 
 * Desktop (lg+):
 *   Left sidebar (240px) fixed/persistent + Scrollable Main Content area
 *   Header hidden — sidebar provides brand presence
 * 
 * Mobile (<lg):
 *   Full width content
 *   Thin header at top
 *   Bottom island navigation
 */
export function MainLayout({
    children,
    showHeader = true,
    disableTransitionLine = false
}: MainLayoutProps) {
    return (
        <div className="flex min-h-screen lg:h-screen lg:overflow-hidden bg-background text-textMain">
            {/* Desktop Sidebar is rendered inside Navigation */}
            <Navigation />

            {/* Content Column — Independent scroll region on Desktop */}
            <div className="flex flex-1 flex-col min-w-0 lg:h-screen lg:overflow-y-auto">
                {/* Slim Header — only visible on mobile */}
                <div className="lg:hidden">
                    {showHeader && <Header />}
                </div>

                {/* Main Content */}
                <main className="flex-1 pb-24 lg:pb-8 pt-2">
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
                        <PageTransition disableLine={disableTransitionLine}>
                            {children}
                        </PageTransition>
                    </div>
                </main>
            </div>
        </div>
    );
}
