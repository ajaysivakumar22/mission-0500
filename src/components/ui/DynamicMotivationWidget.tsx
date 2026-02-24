'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Quote, Shield, GripHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const VISION_BOARD_DATA = [
    // Military / Para SF / IAF
    {
        id: 1,
        quote: "Men apart, every man an emperor.",
        author: "Para Special Forces",
        bgImage: "https://images.unsplash.com/photo-1595304322891-9e8c338bd7b9?q=80&w=2670&auto=format&fit=crop", // Soldier silhouette
    },
    {
        id: 2,
        quote: "Touch the Sky with Glory.",
        author: "Indian Air Force Motto",
        bgImage: "https://images.unsplash.com/photo-1544893700-1c759530db8f?q=80&w=2670&auto=format&fit=crop", // Fighter Jet
    },
    {
        id: 3,
        quote: "Some goals are so worthy, it's glorious even to fail.",
        author: "Capt. Manoj Kumar Pandey, PVC",
        bgImage: "https://images.unsplash.com/photo-1520111162463-c60f2dd3e29f?q=80&w=2574&auto=format&fit=crop", // Mountain peak / struggle
    },
    // David Goggins
    {
        id: 4,
        quote: "They don't know me son!",
        author: "David Goggins",
        bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop", // Dark gritty runner
    },
    {
        id: 5,
        quote: "Who's gonna carry the boats and the logs?!",
        author: "David Goggins",
        bgImage: "https://images.unsplash.com/photo-1444459094715-28b9d3e51025?q=80&w=2670&auto=format&fit=crop", // Rough seas / endurance
    },
    // Vinland Saga
    {
        id: 6,
        quote: "A true warrior needs no sword.",
        author: "Thors (Vinland Saga)",
        bgImage: "https://plus.unsplash.com/premium_photo-1673327150171-855ed06df317?q=80&w=2670&auto=format&fit=crop", // Peaceful tough landscape
    },
    // Berserk / Guts mentality
    {
        id: 7,
        quote: "He died doing whatever it was he wanted to do, didn't he? I bet he was happy.",
        author: "Guts (Berserk)",
        bgImage: "https://images.unsplash.com/photo-1509210087799-73fb617ec7ed?q=80&w=2670&auto=format&fit=crop", // Dark sky eclipse vibe
    },
    {
        id: 8,
        quote: "Struggle, endure, contend. For that alone is the sword of one who defies death.",
        author: "Skull Knight (Berserk)",
        bgImage: "https://images.unsplash.com/photo-1532186651327-6ac236ad6dca?q=80&w=2638&auto=format&fit=crop", // Steel / Dark
    },
    // Apollo Creed & Rocky
    {
        id: 9,
        quote: "There Is No Tomorrow!",
        author: "Apollo Creed",
        bgImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop", // Gym / Workout
    },
    // Anime & Manga Core
    {
        id: 10,
        quote: "Bring on the hardship. It's preferred in a path of carnage.",
        author: "Roronoa Zoro",
        bgImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2669&auto=format&fit=crop",
    },
    {
        id: 11,
        quote: "I'm not gonna run away, I never go back on my word! That's my nindo: my ninja way!",
        author: "Naruto Uzumaki",
        bgImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: 12,
        quote: "A person grows up when he's able to overcome hardships.",
        author: "Jiraiya",
        bgImage: "https://images.unsplash.com/photo-1497215968147-3bd0234a4282?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: 13,
        quote: "I decided to become an Officer. I don't care if I die for it.",
        author: "Aspirant's Vow (Luffy)",
        bgImage: "https://images.unsplash.com/photo-1544894389-724d2da632bd?q=80&w=2670&auto=format&fit=crop",
    },
    // Custom Raw
    {
        id: 14,
        quote: "Just f***ing TRY.",
        author: "Inner Voice",
        bgImage: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=2728&auto=format&fit=crop", // Dark minimal
    },
    {
        id: 15,
        quote: "FOCUS.",
        author: "Discipline",
        bgImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2599&auto=format&fit=crop", // Tunnel vision
    }
];

interface DynamicMotivationWidgetProps {
    defaultPosition?: { x: number; y: number };
}

export function DynamicMotivationWidget({ defaultPosition = { x: 0, y: 0 } }: DynamicMotivationWidgetProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Position state relative to initial position
    // We rely on the parent (MainLayout) to provide the persistent position
    // The internal transform is just for the active drag.

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'motivation-widget',
    });

    useEffect(() => {
        setIsMounted(true);
        setCurrentIndex(Math.floor(Math.random() * VISION_BOARD_DATA.length));

        // Aggressively preload all background images so shuffling has zero flicker
        VISION_BOARD_DATA.forEach((item) => {
            const img = new Image();
            img.src = item.bgImage;
        });
    }, []);

    const handleShuffle = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        setTimeout(() => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * VISION_BOARD_DATA.length);
            } while (nextIndex === currentIndex); // Ensure it's a different quote

            setCurrentIndex(nextIndex);

            setTimeout(() => {
                setIsAnimating(false);
            }, 50);
        }, 300); // Wait for fade out
    };

    if (!isMounted) return null;

    const currentItem = VISION_BOARD_DATA[currentIndex];

    // Combine any stored permanent position offset with the active drag transform
    const style = {
        transform: CSS.Translate.toString({
            x: defaultPosition.x + (transform?.x || 0),
            y: defaultPosition.y + (transform?.y || 0),
            scaleX: 1,
            scaleY: 1
        }),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`fixed right-4 bottom-24 lg:bottom-8 lg:right-8 z-50 transition-all hover:scale-[1.02] ${isCollapsed ? 'w-[200px]' : 'w-[280px] sm:w-[320px]'}`}
        >
            <div
                className={`relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl group bg-[#0B1D13] transition-all duration-300 hover:border-[#FFD60A]/50 hover:shadow-[0_0_30px_rgba(255,214,10,0.15)] flex flex-col ${isCollapsed ? 'h-[60px]' : 'min-h-[220px]'}`}
            >
                {/* Background Image */}
                <div
                    className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-[800ms] ${isAnimating ? 'opacity-0 scale-110 blur-sm' : 'opacity-40 scale-100 blur-0'} group-hover:scale-105`}
                    style={{ backgroundImage: `url(${currentItem.bgImage})` }}
                />

                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0B1D13] via-[#0B1D13]/60 to-transparent" />
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 to-transparent" />

                {/* Content */}
                <div className={`relative z-10 p-4 sm:p-6 flex flex-col h-full justify-between transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                    {/* Top Row: Drag Handle & Controls */}
                    <div className="flex justify-between items-center mb-2">
                        <div
                            {...listeners}
                            {...attributes}
                            className="rounded-full bg-black/50 p-2 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:bg-black/80 cursor-grab active:cursor-grabbing transition-colors"
                            title="Drag to move"
                        >
                            <GripHorizontal className="h-4 w-4" />
                        </div>

                        <div className="flex gap-2">
                            {!isCollapsed && (
                                <div
                                    className="rounded-full bg-black/50 p-2 backdrop-blur-md border border-white/10 text-white/50 group-hover:text-[#FFD60A] hover:bg-black/80 transition-colors group-hover:animate-spin-slow cursor-pointer"
                                    onClick={handleShuffle}
                                    title="Click to shuffle"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </div>
                            )}
                            <div
                                className="rounded-full bg-black/50 p-2 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:bg-black/80 cursor-pointer transition-colors"
                                onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}
                                title={isCollapsed ? "Expand" : "Collapse"}
                            >
                                {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                        </div>
                    </div>

                    {/* Quote Text */}
                    {!isCollapsed && (
                        <div className="mt-2">
                            <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFD60A]/50 mb-2" />
                            <h3 className="text-lg sm:text-xl font-bold font-serif text-white leading-tight mb-4 drop-shadow-md">
                                &quot;{currentItem.quote}&quot;
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-[#FFD60A] rounded-full"></div>
                                <span className="text-[10px] sm:text-xs font-bold text-[#FFD60A] tracking-widest uppercase shadow-black drop-shadow-md">
                                    {currentItem.author}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!isCollapsed && (
                <div className="text-center mt-3 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity hidden sm:block">
                    <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold drop-shadow-md">Drag to move • Click arrow to shuffle</span>
                </div>
            )}
        </div>
    );
}

// Add keyframes for slow spin in globals.css if needed, or rely on normal rotate class with custom duration
