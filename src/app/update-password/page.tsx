'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const supabase = createClient();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Verify we actually have a recovery session — if not, redirect to login
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.replace('/login?error=auth_callback_failed');
            }
        });
    }, []);

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
        // Sign out so the recovery session is cleared, then redirect to login
        await supabase.auth.signOut();
        setTimeout(() => router.replace('/login'), 2000);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0B1D13 0%, #0f2a1a 50%, #0B1D13 100%)' }}
        >
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,214,10,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,214,10,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                        MISSION <span style={{ color: '#FFD60A' }}>0500</span>
                    </h1>
                    <p className="text-sm font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Set New Password
                    </p>
                </div>

                {/* Card */}
                <div
                    className="w-full rounded-2xl border p-8 backdrop-blur-xl"
                    style={{
                        borderColor: 'rgba(255,255,255,0.1)',
                        background: 'rgba(11, 29, 19, 0.7)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                    }}
                >
                    {success ? (
                        <div className="text-center py-4">
                            <div className="text-4xl mb-4">✅</div>
                            <p className="text-white font-bold text-lg mb-2">Password Updated!</p>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                Redirecting you to login...
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-6">
                                Choose New Password
                            </h2>

                            {error && (
                                <div className="mb-4 rounded-lg bg-red-900/60 border border-red-500/30 p-3 text-sm text-red-200">
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

                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => router.replace('/login')}
                                    className="text-sm transition-colors"
                                    style={{ color: 'rgba(255,255,255,0.4)' }}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
