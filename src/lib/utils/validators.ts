export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain an uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain a lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain a number');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

export function validateTaskTitle(title: string): boolean {
    return title.trim().length > 0 && title.trim().length <= 200;
}

export function validateRoutineItem(itemName: string): boolean {
    return itemName.trim().length > 0 && itemName.trim().length <= 150;
}

export function validateGoalTitle(title: string): boolean {
    return title.trim().length > 0 && title.trim().length <= 200;
}

export function validateDisciplineScore(score: number): boolean {
    return score >= 1 && score <= 10 && Number.isInteger(score);
}

export function validateEnergyScore(score: number): boolean {
    return score >= 1 && score <= 10 && Number.isInteger(score);
}
