'use server';

import { revalidatePath } from 'next/cache';
import { createServerActionClient } from '@/lib/supabase/server';
import { validateEmail, validatePassword } from '@/lib/utils/validators';
import { supabaseAdmin } from '@/lib/supabase/admin';
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

        const supabase = await createServerActionClient();

        // Sign up with Supabase Auth
        console.log('Attempting Supabase signup for:', email);
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        console.log('Signup result:', { authError, session: !!authData?.session, user: !!authData?.user });

        if (authError || !authData.user) {
            console.error('Signup failed:', authError);
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
            full_name: fullName,
        });

        if (profileError) {
            console.error('Profile creation error:', profileError);
            return { success: false, error: `Failed to create user profile: ${profileError.message}` };
        }

        // Initialize default routine items for today using Admin client
        const today = new Date().toISOString().split('T')[0];
        const { DEFAULT_ROUTINE_ITEMS } = await import('@/lib/constants/xp-config');

        const routineItems = DEFAULT_ROUTINE_ITEMS.map(item => ({
            user_id: authData.user!.id,
            routine_date: today,
            item_name: item.name,
            item_order: item.order,
        }));

        // Upsert standard routine items (skips duplicates)
        await supabaseAdmin.from('daily_routines').upsert(
            routineItems,
            { onConflict: 'user_id, routine_date, item_name' }
        );

    } catch (error: any) {
        console.error('Signup error:', error);
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

        const supabase = await createServerActionClient();

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
        console.error('Signin error:', error);
        return { success: false, error: error.message || 'An unexpected error occurred' };
    }

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function signOut(): Promise<ApiResponse> {
    try {
        const supabase = await createServerActionClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            return { success: false, error: error.message };
        }

    } catch (error: any) {
        console.error('Signout error:', error);
        return { success: false, error: error.message || 'Failed to sign out' };
    }

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function getCurrentSession() {
    try {
        const supabase = await createServerActionClient();
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            return { success: false, error: error?.message || 'No session', data: null };
        }

        return { success: true, data: { user } };
    } catch (error) {
        return { success: false, error: 'Failed to get session', data: null };
    }
}

export async function getUserProfile(userId: string) {
    try {
        const supabase = await createServerActionClient();

        const { data: user, error } = await supabase
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
        const supabase = await createServerActionClient();

        const { error } = await supabase
            .from('users')
            .update({
                full_name: fullName,
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
