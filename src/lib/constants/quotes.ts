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
            context: "Extreme Ownership"
        },
        {
            quote: "You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.",
            author: "David Goggins",
            context: "Can't Hurt Me"
        },
        {
            quote: "Let us prepare our minds as if we'd come to the very end of life. Let us postpone nothing. Let us balance life's books each day.",
            author: "Seneca",
            context: "Letters from a Stoic"
        },
        {
            quote: "We don't rise to the level of our expectations, we fall to the level of our training.",
            author: "Archilochus",
            context: "Tactical Doctrine"
        },
        {
            quote: "He who has a why to live can bear almost any how.",
            author: "Friedrich Nietzsche",
            context: "Field Philosophy"
        },
        {
            quote: "Action is the foundational key to all success.",
            author: "Pablo Picasso",
            context: "Execution Strategy"
        },
        {
            quote: "Victory belongs to the most persevering.",
            author: "Napoleon Bonaparte",
            context: "Command Philosophy"
        },
        {
            quote: "The more you sweat in peace, the less you bleed in war.",
            author: "Norman Schwarzkopf",
            context: "Field Doctrine"
        },
        {
            quote: "The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood.",
            author: "Theodore Roosevelt",
            context: "The Man in the Arena"
        }
    ],
    scholar: [
        {
            quote: "We suffer more in imagination than in reality.",
            author: "Seneca",
            context: "Letters from a Stoic"
        },
        {
            quote: "Read what you love until you love to read.",
            author: "Naval Ravikant",
            context: "Almanack of Naval"
        },
        {
            quote: "The mind is not a vessel to be filled, but a fire to be kindled.",
            author: "Plutarch",
            context: "Moralia"
        },
        {
            quote: "An investment in knowledge pays the best interest.",
            author: "Benjamin Franklin",
            context: "Poor Richard's"
        },
        {
            quote: "The computer is a bicycle for the mind.",
            author: "Steve Jobs",
            context: "Cognitive Tools"
        },
        {
            quote: "Study the past if you would divine the future.",
            author: "Confucius",
            context: "Analects"
        },
        {
            quote: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
            author: "Alexander Graham Bell",
            context: "Deep Focus Protocol"
        },
        {
            quote: "Knowledge is of no value unless you put it into practice.",
            author: "Anton Chekhov",
            context: "Applied Wisdom"
        },
        {
            quote: "A quiet mind is able to hear intuition over fear.",
            author: "Yvan Byeajee",
            context: "Mental Clarity"
        }
    ],
    athlete: [
        {
            quote: "I've failed over and over and over again in my life. And that is why I succeed.",
            author: "Michael Jordan",
            context: "Championship Mindset"
        },
        {
            quote: "If you're afraid to fail, then you're probably going to fail.",
            author: "Kobe Bryant",
            context: "Mamba Mentality"
        },
        {
            quote: "Don't count the days, make the days count.",
            author: "Muhammad Ali",
            context: "Heavyweight Endurance"
        },
        {
            quote: "The body achieves what the mind believes.",
            author: "Napoleon Hill",
            context: "Physical Discipline"
        },
        {
            quote: "Pain is temporary. It may last a minute, or an hour, or a day, or a year, but eventually it will subside.",
            author: "Lance Armstrong",
            context: "Endurance Protocol"
        },
        {
            quote: "Today I will do what others won't, so tomorrow I can accomplish what others can't.",
            author: "Jerry Rice",
            context: "Peak Performance"
        },
        {
            quote: "Hard work beats talent when talent doesn't work hard.",
            author: "Tim Notke",
            context: "Conditioning Rule"
        },
        {
            quote: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who isn't.",
            author: "Arnold Schwarzenegger",
            context: "Hypertrophy Mindset"
        },
        {
            quote: "Run when you can, walk if you have to, crawl if you must; just never give up.",
            author: "Dean Karnazes",
            context: "Ultramarathon Doctrine"
        }
    ],
    protagonist: [
        {
            quote: "Bring on the hardship. It's preferred in a path of carnage.",
            author: "Roronoa Zoro",
            context: "One Piece"
        },
        {
            quote: "Those who cannot acknowledge themselves will eventually fail.",
            author: "Itachi Uchiha",
            context: "Naruto"
        },
        {
            quote: "If you don't take risks, you can't create a future.",
            author: "Monkey D. Luffy",
            context: "One Piece"
        },
        {
            quote: "If you just submit yourself to fate, then that's the end of it.",
            author: "Saitama",
            context: "One Punch Man"
        },
        {
            quote: "A lesson without pain is meaningless. For you cannot gain something without sacrificing something else.",
            author: "Edward Elric",
            context: "Fullmetal Alchemist"
        },
        {
            quote: "Whether you think you can, or you think you can't – you're right.",
            author: "Henry Ford",
            context: "Unwavering Ambition"
        },
        {
            quote: "Push through the pain. Giving up hurts more.",
            author: "Vegeta",
            context: "Dragon Ball Z"
        },
        {
            quote: "No matter how weak or unworthy you feel, keep your heart burning.",
            author: "Kyojuro Rengoku",
            context: "Demon Slayer"
        },
        {
            quote: "The world isn't perfect. But it's there for us, doing the best it can... that's what makes it so damn beautiful.",
            author: "Roy Mustang",
            context: "Fullmetal Alchemist"
        }
    ]
};

const PAGE_ROUTE_OFFSETS: Record<string, number> = {
    dashboard: 0,
    routine: 1,
    tasks: 2,
    goals: 3,
    report: 4,
    medals: 5,
    settings: 6,
    global: 0,
};

/**
 * Deterministic quote selection based on date + pageKey + theme.
 * Keeps quote stable throughout the day and unique across different pages.
 */
export function getQuoteForContext(theme: ThemeType, pageKey: string = 'dashboard'): QuoteItem {
    const list = THEME_QUOTES[theme] || THEME_QUOTES['operator'];
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

    const pageOffset = PAGE_ROUTE_OFFSETS[pageKey.toLowerCase()] ?? 0;
    const index = (dayOfYear + pageOffset) % list.length;
    return list[index];
}

// Legacy fallback for backward compatibility
export function getDailyQuote(theme: ThemeType): QuoteItem {
    return getQuoteForContext(theme, 'dashboard');
}
