/**
 * Strip potential XSS vectors from user-provided text.
 * Escapes HTML entities in text that will be stored in the database.
 */
export function sanitizeText(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/** Sanitize if defined, pass through undefined */
export function sanitizeOptional(input: string | undefined): string | undefined {
    return input !== undefined ? sanitizeText(input) : undefined;
}
