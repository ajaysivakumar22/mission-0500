import { getUserSettings } from '@/server/actions/settings';

export async function getServerDate(userId: string): Promise<string> {
    const { data: userSettings } = await getUserSettings(userId);
    const userTimezone = userSettings?.timezone || 'UTC';
    
    try {
        return new Intl.DateTimeFormat('en-CA', { 
            timeZone: userTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date());
    } catch(e) {
        return new Date().toISOString().split('T')[0];
    }
}