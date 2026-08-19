'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon?: React.ReactNode;
    className?: string;
    delay?: number;
}

export function StatCard({ label, value, unit, icon, className = '', delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: 'easeOut' }}
            className={`card p-5 ${className}`}
        >
            <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-mono-tech text-textMuted uppercase tracking-widest">{label}</p>
                {icon && (
                    <div className="text-textMuted">{icon}</div>
                )}
            </div>
            <p className="text-2xl font-black text-textMain leading-none tabular-nums">
                {value}
                {unit && <span className="text-base text-accent font-semibold ml-1">{unit}</span>}
            </p>
        </motion.div>
    );
}
