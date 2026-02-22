export function calculateStreak(completionDates: Date[]): {
    current: number;
    longest: number;
    lastDate?: Date;
} {
    if (completionDates.length === 0) {
        return { current: 0, longest: 0 };
    }

    // Sort dates in ascending order
    const sorted = [...completionDates].sort((a, b) => a.getTime() - b.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Check if last completion was today or yesterday
    const lastCompletion = new Date(sorted[sorted.length - 1]);
    lastCompletion.setHours(0, 0, 0, 0);

    const daysSinceLastCompletion = Math.floor((today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastCompletion > 1) {
        currentStreak = 0;
    } else {
        currentStreak = 1;
    }

    // Calculate streaks
    for (let i = 1; i < sorted.length; i++) {
        const prevDate = new Date(sorted[i - 1]);
        const currDate = new Date(sorted[i]);
        prevDate.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            tempStreak++;
            if (daysSinceLastCompletion <= 1 && i === sorted.length - 1) {
                currentStreak = tempStreak;
            }
        } else {
            tempStreak = 1;
        }

        longestStreak = Math.max(longestStreak, tempStreak);
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return {
        current: currentStreak,
        longest: longestStreak,
        lastDate: sorted[sorted.length - 1],
    };
}
