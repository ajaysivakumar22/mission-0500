import {
    validateEmail,
    validatePassword,
    validateTaskTitle,
    validateRoutineItem,
    validateGoalTitle,
    validateDisciplineScore,
    validateEnergyScore,
} from '@/lib/utils/validators';

describe('validateEmail', () => {
    it('accepts valid emails', () => {
        expect(validateEmail('user@example.com')).toBe(true);
        expect(validateEmail('test.user@domain.co.in')).toBe(true);
    });

    it('rejects invalid emails', () => {
        expect(validateEmail('')).toBe(false);
        expect(validateEmail('not-an-email')).toBe(false);
        expect(validateEmail('missing@domain')).toBe(false);
        expect(validateEmail('@no-local.com')).toBe(false);
        expect(validateEmail('spaces in@email.com')).toBe(false);
    });
});

describe('validatePassword', () => {
    it('accepts strong passwords', () => {
        const result = validatePassword('StrongPass1');
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects short passwords', () => {
        const result = validatePassword('Sh1');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('requires uppercase letter', () => {
        const result = validatePassword('nouppercase1');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Password must contain an uppercase letter');
    });

    it('requires lowercase letter', () => {
        const result = validatePassword('NOLOWERCASE1');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Password must contain a lowercase letter');
    });

    it('requires a number', () => {
        const result = validatePassword('NoNumberHere');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Password must contain a number');
    });

    it('returns multiple errors', () => {
        const result = validatePassword('ab');
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
    });
});

describe('validateTaskTitle', () => {
    it('accepts valid titles', () => {
        expect(validateTaskTitle('Do the thing')).toBe(true);
        expect(validateTaskTitle('A')).toBe(true);
    });

    it('rejects empty titles', () => {
        expect(validateTaskTitle('')).toBe(false);
        expect(validateTaskTitle('   ')).toBe(false);
    });

    it('rejects titles over 200 chars', () => {
        expect(validateTaskTitle('x'.repeat(201))).toBe(false);
    });
});

describe('validateRoutineItem', () => {
    it('accepts valid items', () => {
        expect(validateRoutineItem('Wake up early')).toBe(true);
    });

    it('rejects empty items', () => {
        expect(validateRoutineItem('')).toBe(false);
    });

    it('rejects items over 150 chars', () => {
        expect(validateRoutineItem('x'.repeat(151))).toBe(false);
    });
});

describe('validateGoalTitle', () => {
    it('accepts valid titles', () => {
        expect(validateGoalTitle('Run a marathon')).toBe(true);
    });

    it('rejects empty titles', () => {
        expect(validateGoalTitle('')).toBe(false);
    });
});

describe('validateDisciplineScore', () => {
    it('accepts 1-10 integers', () => {
        for (let i = 1; i <= 10; i++) {
            expect(validateDisciplineScore(i)).toBe(true);
        }
    });

    it('rejects out of range', () => {
        expect(validateDisciplineScore(0)).toBe(false);
        expect(validateDisciplineScore(11)).toBe(false);
        expect(validateDisciplineScore(-1)).toBe(false);
    });

    it('rejects decimals', () => {
        expect(validateDisciplineScore(5.5)).toBe(false);
    });
});

describe('validateEnergyScore', () => {
    it('accepts 1-10 integers', () => {
        expect(validateEnergyScore(5)).toBe(true);
    });

    it('rejects out of range', () => {
        expect(validateEnergyScore(0)).toBe(false);
        expect(validateEnergyScore(11)).toBe(false);
    });
});
