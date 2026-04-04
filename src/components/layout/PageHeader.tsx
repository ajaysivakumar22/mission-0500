import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 border-b border-white/5 pb-6 relative z-10"
        >
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50 tracking-tight uppercase drop-shadow-md">
                {title}
            </h1>
            {subtitle && (
                <p className="mt-3 text-lg text-white/50 max-w-2xl font-medium tracking-wide">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
