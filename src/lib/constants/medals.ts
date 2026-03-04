export interface Medal {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    requirement_type: 'streak' | 'xp' | 'tasks_completed' | 'routines_completed';
    requirement_value: number;
}

export const MEDALS: Medal[] = [
    {
        id: 'iron_discipline',
        name: 'Iron Discipline',
        description: 'Maintain a 7-day perfect streak.',
        icon: '⚔️',
        color: 'from-gray-400 to-gray-600',
        requirement_type: 'streak',
        requirement_value: 7,
    },
    {
        id: 'unbreakable',
        name: 'Unbreakable Aspirant',
        description: 'Maintain a massive 30-day streak.',
        icon: '🛡️',
        color: 'from-blue-400 to-blue-700',
        requirement_type: 'streak',
        requirement_value: 30,
    },
    {
        id: 'first_blood',
        name: 'First Blood',
        description: 'Complete 100 daily tasks.',
        icon: '🩸',
        color: 'from-red-500 to-red-800',
        requirement_type: 'tasks_completed',
        requirement_value: 100,
    },
    {
        id: 'officer_material',
        name: 'Officer Material',
        description: 'Reach 10,000 Total XP.',
        icon: '⭐',
        color: 'from-yellow-400 to-yellow-600',
        requirement_type: 'xp',
        requirement_value: 10000,
    },
    {
        id: 'relentless',
        name: 'Relentless Operator',
        description: 'Complete 50 morning routines.',
        icon: '🌅',
        color: 'from-orange-400 to-red-500',
        requirement_type: 'routines_completed',
        requirement_value: 50,
    }
];
