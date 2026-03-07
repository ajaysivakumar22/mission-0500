import { getServerSession } from '@/lib/supabase/server';

/**
 * Verify the caller's session matches the provided userId.
 * All server actions must call this before trusting the userId parameter.
 * Returns the verified userId or null if unauthorized.
 */
export async function verifyCallerIdentity(userId: string): Promise<string | null> {
    const session = await getServerSession();
    if (!session?.user?.id) return null;
    if (session.user.id !== userId) return null;
    return session.user.id;
}
