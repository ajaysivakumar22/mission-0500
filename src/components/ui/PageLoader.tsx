'use client';

import { motion } from 'framer-motion';

export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1D13] backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center justify-center space-y-6"
            >
                {/* Loader Ring + Logo */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#0B1D13] shadow-[0_0_50px_rgba(255,214,10,0.15)]">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#FFD60A] border-r-[#FFD60A]/30"
                    />
                    <div className="flex items-center justify-center">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#9CA3AF] tracking-tighter">
                            M<span className="text-[#FFD60A]">05</span>
                        </span>
                    </div>
                </div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex flex-col items-center space-y-2"
                >
                    <p className="text-sm font-bold tracking-[0.2em] text-[#FFD60A] uppercase">
                        Command Center
                    </p>
                    <div className="flex space-x-1">
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                            className="h-1.5 w-1.5 rounded-full bg-white/50"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                            className="h-1.5 w-1.5 rounded-full bg-white/50"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                            className="h-1.5 w-1.5 rounded-full bg-white/50"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
