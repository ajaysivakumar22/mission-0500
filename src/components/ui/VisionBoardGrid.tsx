import React from 'react';
import { Quote } from 'lucide-react';

interface GridItemProps {
    quote?: string;
    author?: string;
    bgImage: string;
    className?: string;
}

function GridItem({ quote, author, bgImage, className = '' }: GridItemProps) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-white/5 shadow-xl group bg-black transition-all duration-500 hover:border-[#FFD60A]/30 hover:shadow-[0_0_25px_rgba(255,214,10,0.1)] ${className}`}>
            <div
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[2000ms] opacity-60 group-hover:scale-110 group-hover:opacity-80"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {quote && (
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col justify-end h-full">
                    <Quote className="h-4 w-4 text-[#FFD60A]/50 mb-2 transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <p className="text-white font-serif font-bold text-lg md:text-xl leading-tight drop-shadow-lg mb-2">
                        &quot;{quote}&quot;
                    </p>
                    <span className="text-xs font-black text-[#FFD60A] tracking-widest uppercase items-center flex gap-2">
                        <div className="w-3 h-0.5 bg-[#FFD60A]"></div>
                        {author}
                    </span>
                </div>
            )}
        </div>
    );
}

export function VisionBoardGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
            {/* Main Large Image - Left Side */}
            <GridItem
                quote="I'm not gonna run away, I never go back on my word!"
                author="Naruto Uzumaki"
                bgImage="https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2670&auto=format&fit=crop"
                className="md:col-span-8 md:row-span-2 min-h-[300px]"
            />

            {/* Top Right smaller */}
            <GridItem
                quote="There is no tomorrow."
                author="Apollo Creed"
                bgImage="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop"
                className="hidden md:block md:col-span-4 min-h-[150px]"
            />

            {/* Bottom Right smaller */}
            <GridItem
                quote="Focus."
                author="Discipline"
                bgImage="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2599&auto=format&fit=crop"
                className="hidden md:block md:col-span-4 min-h-[150px]"
            />
        </div>
    );
}
