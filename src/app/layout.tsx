import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { ToastProvider } from '@/components/ui/Toast';
import { getServerSession } from '@/lib/supabase/server';
import { SystemSyncer } from '@/components/layout/SystemSyncer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MISSION 0500 - Personal Command Center',
    description: 'Personal discipline tracking and goal management system',
    manifest: '/manifest.json',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();
    
    return (
        <html lang="en">
            <body className={inter.className}>
                {session?.user && <SystemSyncer userId={session.user.id} />}
                <ThemeProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
