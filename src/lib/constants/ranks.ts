export const RANKS = {
    CADET: {
        name: 'Cadet',
        minXP: 0,
        maxXP: 499,
        color: '#94a3b8',
        emoji: '⭐',
    },
    SENIOR_CADET: {
        name: 'Senior Cadet',
        minXP: 500,
        maxXP: 1499,
        color: '#fbbf24',
        emoji: '⭐⭐',
    },
    OFFICER: {
        name: 'Officer',
        minXP: 1500,
        maxXP: 2999,
        color: '#22c55e',
        emoji: '⭐⭐⭐',
    },
    COMMANDER: {
        name: 'Commander',
        minXP: 3000,
        maxXP: Infinity,
        color: '#ef4444',
        emoji: '👑',
    },
} as const;
