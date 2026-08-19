'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Shield } from 'lucide-react';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const supabase = createClient();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'PASSWORD_RECOVERY') {
                    // Recovery session confirmed
                } else if (!session) {
                    router.replace('/login?error=auth_callback_failed');
                }
            }
        );

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setTimeout(() => {
                    supabase.auth.getSession().then(({ data: { session: s } }) => {
                        if (!s) router.replace('/login?error=auth_callback_failed');
                    });
                }, 1500);
            }
        });

        return () => subscription.unsubscribe();
    }, [router, supabase.auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({ password });

        if (updateError) {
            setError(updateError.message || 'Failed to update password. Please request a new reset link.');
            setIsLoading(false);
            return;
        }

        setSuccess(true);
        await supabase.auth.signOut();
        setTimeout(() => router.replace('/login'), 2000);
    };

    return (
        <div className="min-h-screen bg-background text-textMain flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-elevated">
                {/* Brand Header */}
                <div className="flex items-center gap-3 justify-center mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D6A52C] text-[#20382B] font-black">
                        <Shield className="h-4 w-4 fill-[#20382B]" />
                    </div>
                    <div>
                        <span className="font-mono-tech text-[10px] text-accent uppercase tracking-widest block leading-none">MISSION</span>
                        <span className="text-lg font-black text-textMain tracking-wider block">0500</span>
                    </div>
                </div>

                {success ? (
                    <div className="text-center py-6">
                        <div className="text-3xl mb-3">✅</div>
                        <p className="text-textMain font-bold text-base mb-1">Password Updated!</p>
                        <p className="text-xs text-textMuted">Redirecting you to sign in...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-center">
                            <h2 className="text-xl font-bold text-textMain">Choose New Password</h2>
                            <p className="text-xs text-textMuted mt-1">Set a secure password for your command center account.</p>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-xl bg-danger/10 border border-danger/20 p-3 text-xs text-danger font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="New Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                placeholder="Min. 8 characters"
                                required
                            />
                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                placeholder="Re-enter password"
                                required
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                isLoading={isLoading}
                                className="w-full"
                            >
                                Update Password
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => router.replace('/login')}
                                className="text-xs text-textMuted hover:text-accent transition-colors"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
