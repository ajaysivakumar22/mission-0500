import { ThemeType } from '../context/ThemeContext';

export interface QuoteItem {
    quote: string;
    author: string;
    context?: string;
    bgImageUrl?: string;
}

export const THEME_QUOTES: Record<ThemeType, QuoteItem[]> = {
    operator: [
        {
            quote: "Discipline equals freedom.",
            author: "Jocko Willink",
            bgImageUrl: "https://images.unsplash.com/photo-1517436073-3b1b1b4b1b9e?q=80&w=2670&auto=format&fit=crop"
        },
        {
            quote: "You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.",
            author: "David Goggins",
            bgImageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop"
        },
        {
            quote: "Let us prepare our minds as if we'd come to the very end of life. Let us postpone nothing. Let us balance life's books each day.",
            author: "Seneca",
            bgImageUrl: "https://images.unsplash.com/photo-1508247278274-eb7bba2cbeaa?q=80&w=2574&auto=format&fit=crop"
        }
    ],
    scholar: [
        {
            quote: "We suffer more in imagination than in reality.",
            author: "Seneca",
            bgImageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2670&auto=format&fit=crop"
        },
        {
            quote: "Read what you love until you love to read.",
            author: "Naval Ravikant",
            bgImageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2228&auto=format&fit=crop"
        },
        {
            quote: "The mind is not a vessel to be filled, but a fire to be kindled.",
            author: "Plutarch",
            bgImageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2670&auto=format&fit=crop"
        }
    ],
    athlete: [
        {
            quote: "I've failed over and over and over again in my life. And that is why I succeed.",
            author: "Michael Jordan",
            bgImageUrl: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2671&auto=format&fit=crop"
        },
        {
            quote: "If you're afraid to fail, then you're probably going to fail.",
            author: "Kobe Bryant",
            bgImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbacbf27?q=80&w=2670&auto=format&fit=crop"
        },
        {
            quote: "Don't count the days, make the days count.",
            author: "Muhammad Ali",
            bgImageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop"
        }
    ],
    protagonist: [
        {
            quote: "Bring on the hardship. It's preferred in a path of carnage.",
            author: "Roronoa Zoro",
            context: "One Piece",
            bgImageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2669&auto=format&fit=crop"
        },
        {
            quote: "Those who cannot acknowledge themselves will eventually fail.",
            author: "Itachi Uchiha",
            context: "Naruto",
            bgImageUrl: "https://images.unsplash.com/photo-1518774780287-f823f669e46a?q=80&w=2670&auto=format&fit=crop"
        },
        {
            quote: "If you don't take risks, you can't create a future.",
            author: "Monkey D. Luffy",
            context: "One Piece",
            bgImageUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2670&auto=format&fit=crop"
        }
    ]
};

// Seeded random approach based on the date so the quote stays the same all day
export function getDailyQuote(theme: ThemeType): QuoteItem {
    const list = THEME_QUOTES[theme] || THEME_QUOTES['operator'];
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % list.length;
    return list[index];
}
