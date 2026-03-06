import { ROUTINE_TEMPLATES, XP_RULES, DEFAULT_ROUTINE_ITEMS } from '@/lib/constants/xp-config';
import type { ArchetypeKey } from '@/lib/constants/xp-config';

describe('XP_RULES', () => {
    it('has all required XP values', () => {
        expect(XP_RULES.ROUTINE_ITEM).toBe(5);
        expect(XP_RULES.TASK_COMPLETION).toBe(10);
        expect(XP_RULES.FULL_DAY_BONUS).toBe(25);
        expect(XP_RULES.GOAL_LOG_ENTRY).toBe(15);
    });
});

describe('ROUTINE_TEMPLATES', () => {
    const archetypes: ArchetypeKey[] = ['operator', 'scholar', 'builder', 'athlete'];

    it('has all 4 archetypes', () => {
        expect(Object.keys(ROUTINE_TEMPLATES)).toEqual(archetypes);
    });

    archetypes.forEach(key => {
        describe(`${key} template`, () => {
            const template = ROUTINE_TEMPLATES[key];

            it('has a label and description', () => {
                expect(template.label.length).toBeGreaterThan(0);
                expect(template.description.length).toBeGreaterThan(0);
            });

            it('has a valid icon name', () => {
                expect(['Shield', 'BookOpen', 'Rocket', 'Dumbbell']).toContain(template.icon);
            });

            it('has 10 routine items', () => {
                expect(template.items).toHaveLength(10);
            });

            it('has items with unique orders 1-10', () => {
                const orders = template.items.map(i => i.order);
                expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            });

            it('has non-empty item names', () => {
                template.items.forEach(item => {
                    expect(item.name.trim().length).toBeGreaterThan(0);
                });
            });
        });
    });
});

describe('DEFAULT_ROUTINE_ITEMS', () => {
    it('is the operator template items', () => {
        expect(DEFAULT_ROUTINE_ITEMS).toEqual(ROUTINE_TEMPLATES.operator.items);
    });
});
