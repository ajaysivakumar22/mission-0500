/**
 * Centralized Date Utilities for MISSION 0500 Field Editorial System
 */

export function getFormattedDate(dateInput?: Date | string): string {
    const date = dateInput ? new Date(dateInput) : new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

export function getWeekdayUpper(dateInput?: Date | string): string {
    const date = dateInput ? new Date(dateInput) : new Date();
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
}

export function getDayOfYear(dateInput?: Date | string): number {
    const date = dateInput ? new Date(dateInput) : new Date();
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

export function getOperationalDateString(dateInput?: Date | string): string {
    const formattedDate = getFormattedDate(dateInput);
    const weekday = getWeekdayUpper(dateInput);
    return `${formattedDate} · ${weekday}`;
}

export function getHeaderDateString(dateInput?: Date | string): string {
    return getFormattedDate(dateInput);
}
