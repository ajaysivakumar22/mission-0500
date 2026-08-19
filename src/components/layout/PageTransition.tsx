'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
    disableLine?: boolean;
}

export function PageTransition({ children, disableLine = false }: PageTransitionProps) {
    const pathname = usePathname();
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className="w-full">{children}</div>;
    }

    return (
        <div className="relative w-full">
            {/* Authoritative Single Top Saffron Indicator Accent Line on Navigation */}
            {!disableLine && (
                <motion.div
                    key={`line-${pathname}`}
                    initial={{ scaleX: 0, opacity: 1 }}
                    animate={{ scaleX: 1, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-[#D6A52C] origin-left pointer-events-none"
                />
            )}

            {/* Main Page Entrance */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.2,
                    ease: [0.25, 0.1, 0.25, 1.0],
                }}
                className="w-full"
            >
                {children}
            </motion.div>
        </div>
    );
}
