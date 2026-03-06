import {
    getPriorityLabel,
    getPriorityColor,
    getCategoryLabel,
} from '@/lib/utils/formatters';

describe('getPriorityLabel', () => {
    it('returns correct labels for known priorities', () => {
        expect(getPriorityLabel('low')).toBe('Low Priority');
        expect(getPriorityLabel('medium')).toBe('Medium Priority');
        expect(getPriorityLabel('high')).toBe('High Priority');
    });

    it('returns the raw value for unknown priorities', () => {
        expect(getPriorityLabel('critical')).toBe('critical');
    });
});

describe('getPriorityColor', () => {
    it('returns correct colors', () => {
        expect(getPriorityColor('low')).toBe('#94a3b8');
        expect(getPriorityColor('medium')).toBe('#f59e0b');
        expect(getPriorityColor('high')).toBe('#ef4444');
    });

    it('returns default color for unknown priority', () => {
        expect(getPriorityColor('unknown')).toBe('#94a3b8');
    });
});

describe('getCategoryLabel', () => {
    it('returns formatted labels', () => {
        expect(getCategoryLabel('short_term')).toBe('Short-term');
        expect(getCategoryLabel('mid_term')).toBe('Mid-term');
        expect(getCategoryLabel('long_term')).toBe('Long-term');
    });

    it('returns raw value for unknown categories', () => {
        expect(getCategoryLabel('custom')).toBe('custom');
    });
});
