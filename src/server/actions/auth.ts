'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { validateEmail, validatePassword } from '@/lib/utils/validators';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { verifyCallerIdentity } from '@/server/utils/auth-guard';
import { sanitizeText } from '@/server/utils/sanitize';
import type { ApiResponse } from '@/types';

export async function signUp(
    email: string,
    password: string,
    fullName: string
): Promise<ApiResponse> {
    try {
        // Validate inputs
        if (!validateEmail(email)) {
            return { success: false, error: 'Invalid email format' };
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return { success: false, error: passwordValidation.errors[0] };
        }

        if (!fullName || fullName.trim().length === 0) {
            return { success: false, error: 'Full name is required' };
        }

        const supabase = await createClient();

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (authError || !authData.user) {
            return { success: false, error: authError?.message || 'Signup failed' };
        }

        if (!authData.session) {
            // User created but no session - likely email confirmation required
            return {
                success: true,
                data: { session: null, emailConfirmationRequired: true }
            };
        }

        // Create user profile using Admin client (bypasses RLS)
        // Use upsert to handle potential conflicts if DB trigger already ran
        const { error: profileError } = await supabaseAdmin.from('users').upsert({
            id: authData.user.id,
            email,
            full_name: sanitizeText(fullName),
        });

        if (profileError) {
            return { success: false, error: `Failed to create user profile: ${profileError.message}` };
        }

        // Routines are initialized during onboarding archetype selection
        // or on first visit to /routine via initializeDefaultRoutine()

    } catch (error: any) {
        return { success: false, error: error.message || 'An unexpected error occurred' };
    }

    revalidatePath('/', 'layout');

    return { success: true };
}

export async function signIn(
    email: string,
    password: string
): Promise<ApiResponse> {
    try {
        if (!validateEmail(email)) {
            return { success: false, error: 'Invalid email format' };
        }

        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            return { success: false, error: error?.message || 'Invalid credentials' };
        }

        if (!data.session) {
            return { success: false, error: 'Login succeeded but no session was created. Please check your email verification.' };
        }

    } catch (error: any) {
        return { success: false, error: error.message || 'An unexpected error occurred' };
    }

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function signOut(): Promise<ApiResponse> {
    // Clear auth cookies directly — no network call to Supabase needed.
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
        if (cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')) {
            cookieStore.delete(cookie.name);
        }
    }

    revalidatePath('/', 'layout');
    redirect('/login');
}

export async function getCurrentSession() {
    try {
        const { getServerSession } = await import('@/lib/supabase/server');
        const session = await getServerSession();
        if (!session) {
            return { success: false, error: 'No session', data: null };
        }
        return { success: true, data: { user: session.user } };
    } catch (error) {
        return { success: false, error: 'Failed to get session', data: null };
    }
}

export async function getUserProfile(userId: string) {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized', data: null };

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            return { success: false, error: error.message, data: null };
        }

        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: 'Failed to fetch user profile', data: null };
    }
}

export async function updateUserProfile(
    userId: string,
    fullName: string,
    avatarUrl?: string
): Promise<ApiResponse> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const { error } = await supabaseAdmin
            .from('users')
            .update({
                full_name: sanitizeText(fullName),
                ...(avatarUrl && { avatar_url: avatarUrl }),
            })
            .eq('id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/settings');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update profile' };
    }
}
