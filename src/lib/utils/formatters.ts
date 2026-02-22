export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatMilitaryTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function formatRelativeTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(d);
}

export function getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
        low: 'Low Priority',
        medium: 'Medium Priority',
        high: 'High Priority',
    };
    return labels[priority] || priority;
}

export function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
        low: '#94a3b8',
        medium: '#f59e0b',
        high: '#ef4444',
    };
    return colors[priority] || '#94a3b8';
}

export function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        short_term: 'Short-term',
        mid_term: 'Mid-term',
        long_term: 'Long-term',
    };
    return labels[category] || category;
}
