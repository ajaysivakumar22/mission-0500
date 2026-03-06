export const XP_RULES = {
    ROUTINE_ITEM: 5,
    TASK_COMPLETION: 10,
    FULL_DAY_BONUS: 25,
    GOAL_LOG_ENTRY: 15,
} as const;

export type ArchetypeKey = 'operator' | 'scholar' | 'builder' | 'athlete';

export interface RoutineTemplate {
    label: string;
    description: string;
    icon: string; // lucide icon name
    items: readonly { name: string; order: number }[];
}

export const ROUTINE_TEMPLATES: Record<ArchetypeKey, RoutineTemplate> = {
    operator: {
        label: 'Operator',
        description: 'Military precision. Early wake-ups, PT, structured discipline blocks.',
        icon: 'Shield',
        items: [
            { name: 'Wake up at 0500 hrs', order: 1 },
            { name: 'Morning PT / Run', order: 2 },
            { name: 'Cold shower & gear up', order: 3 },
            { name: 'Deep work block 1', order: 4 },
            { name: 'Skill training session', order: 5 },
            { name: 'Deep work block 2', order: 6 },
            { name: 'Evening physical training', order: 7 },
            { name: 'Review & plan tomorrow', order: 8 },
            { name: 'Proper nutrition & hydration', order: 9 },
            { name: 'Lights out at 2200 hrs', order: 10 },
        ],
    },
    scholar: {
        label: 'Scholar',
        description: 'Academic excellence. Study sessions, reading, practice problems.',
        icon: 'BookOpen',
        items: [
            { name: 'Wake up early & morning routine', order: 1 },
            { name: 'Review notes from yesterday', order: 2 },
            { name: 'Focused study block 1', order: 3 },
            { name: 'Practice problems / exercises', order: 4 },
            { name: 'Focused study block 2', order: 5 },
            { name: 'Read 30 minutes (non-fiction)', order: 6 },
            { name: 'Revision & flashcards', order: 7 },
            { name: 'Plan tomorrow\'s study agenda', order: 8 },
            { name: 'Proper meals & hydration', order: 9 },
            { name: 'Sleep by 2300 hrs', order: 10 },
        ],
    },
    builder: {
        label: 'Builder',
        description: 'Ship fast, iterate faster. Deep work, planning, execution.',
        icon: 'Rocket',
        items: [
            { name: 'Wake up & morning routine', order: 1 },
            { name: 'Review priorities & KPIs', order: 2 },
            { name: 'Deep work block — build', order: 3 },
            { name: 'Respond to messages & email', order: 4 },
            { name: 'Deep work block — iterate', order: 5 },
            { name: 'Learn something new (30 min)', order: 6 },
            { name: 'Exercise / movement break', order: 7 },
            { name: 'End-of-day review & ship log', order: 8 },
            { name: 'Proper meals & hydration', order: 9 },
            { name: 'Wind down by 2300 hrs', order: 10 },
        ],
    },
    athlete: {
        label: 'Athlete',
        description: 'Peak performance. Training, nutrition, recovery, mental prep.',
        icon: 'Dumbbell',
        items: [
            { name: 'Wake up at 0530 hrs', order: 1 },
            { name: 'Pre-workout nutrition', order: 2 },
            { name: 'Morning training session', order: 3 },
            { name: 'Post-workout meal & recovery', order: 4 },
            { name: 'Skill / technique practice', order: 5 },
            { name: 'Afternoon training session', order: 6 },
            { name: 'Stretching & mobility work', order: 7 },
            { name: 'Visualization & mental prep', order: 8 },
            { name: 'Track macros & hydration', order: 9 },
            { name: 'Lights out at 2200 hrs', order: 10 },
        ],
    },
} as const;

// Default fallback for backward compatibility
export const DEFAULT_ROUTINE_ITEMS = ROUTINE_TEMPLATES.operator.items;
