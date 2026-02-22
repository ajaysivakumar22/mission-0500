export const XP_CONFIG = {
    ROUTINE_COMPLETION: 5,
    TASK_COMPLETION: 10,
    FULL_DAY_BONUS: 25,
} as const;

export const RANK_THRESHOLDS = {
    Cadet: 0,
    'Senior Cadet': 500,
    Officer: 1500,
    Commander: 3000,
} as const;

export type Rank = keyof typeof RANK_THRESHOLDS;

export function calculateRank(totalXP: number): Rank {
    if (totalXP >= RANK_THRESHOLDS.Commander) return 'Commander';
    if (totalXP >= RANK_THRESHOLDS.Officer) return 'Officer';
    if (totalXP >= RANK_THRESHOLDS['Senior Cadet']) return 'Senior Cadet';
    return 'Cadet';
}

export function getXPForNextRank(currentRank: Rank): number {
    const ranks = Object.keys(RANK_THRESHOLDS) as Rank[];
    const currentIndex = ranks.indexOf(currentRank);
    if (currentIndex === ranks.length - 1) return RANK_THRESHOLDS.Commander + 5000;
    return RANK_THRESHOLDS[ranks[currentIndex + 1]];
}

export function getRankColor(rank: Rank): string {
    const colors: Record<Rank, string> = {
        Cadet: '#94a3b8',
        'Senior Cadet': '#fbbf24',
        Officer: '#22c55e',
        Commander: '#ef4444',
    };
    return colors[rank];
}

export function getRankEmoji(rank: Rank): string {
    const emojis: Record<Rank, string> = {
        Cadet: '⭐',
        'Senior Cadet': '⭐⭐',
        Officer: '⭐⭐⭐',
        Commander: '👑',
    };
    return emojis[rank];
}
