export const XP_RULES = {
    ROUTINE_ITEM: 5,
    TASK_COMPLETION: 10,
    FULL_DAY_BONUS: 25,
    GOAL_LOG_ENTRY: 15,
} as const;

export const DEFAULT_ROUTINE_ITEMS = [
    { name: 'Wake up at 0500 hrs', order: 1 },
    { name: 'Morning run / gym', order: 2 },
    { name: 'Morning CDS preparation', order: 3 },
    { name: 'Evening CDS preparation', order: 4 },
    { name: 'Placement preparation', order: 5 },
    { name: 'LeetCode practice', order: 6 },
    { name: 'Proper water intake', order: 7 },
    { name: 'Sleep at 2300 hrs', order: 8 },
    { name: 'Proper calorie intake', order: 9 },
    { name: 'Do not miss a meal', order: 10 },
] as const;
