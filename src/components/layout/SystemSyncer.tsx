'use client';

import { useEffect, useRef } from 'react';
import { updateUserSettings } from '@/server/actions/settings';

export function SystemSyncer({ userId }: { userId: string }) {
    const synced = useRef(false);

    useEffect(() => {
        if (synced.current) return;
        synced.current = true; // prevent double firing in React strict mode

        const doSync = async () => {
            try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                // Update silently in background. If it fails, no problem, we will retry next session.
                await updateUserSettings(userId, { timezone: tz });
            } catch (e) {
                // Timezone sync failed — will retry next session
            }
        };

        doSync();
    }, [userId]);

    return null;
}