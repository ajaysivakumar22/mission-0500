'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { Shield } from 'lucide-react';

export default function LoginPage() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const errorParam = searchParams.get('error');
        const verified = searchParams.get('verified');
        if (errorParam === 'auth_callback_failed') {
            setError('Email verification failed or link expired. Please try again.');
        }
        if (verified === 'true') {
            setSuccessMessage('Email verified successfully! You can now sign in.');
        }
    }, [searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        if (isForgotPassword) {
            if (!formData.email.trim()) {
                setError('Please enter your email address');
                setIsLoading(false);
                return;
            }
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
                redirectTo: `${window.location.origin}/login`,
            });
            if (resetError) {
                setError(resetError.message);
            } else {
                setSuccessMessage('Password reset link sent! Check your email inbox.');
            }
            setIsLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                if (!formData.fullName.trim()) {
                    setError('Full name is required');
                    setIsLoading(false);
                    return;
                }

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: { full_name: formData.fullName },
                    },
                });

                if (authError) {
                    setError(authError.message);
                    setIsLoading(false);
                    return;
                }

                if (!authData.session) {
                    setSuccessMessage('Account created! Please check your email to confirm your account before logging in.');
                    setIsLoading(false);
                    return;
                }

                try {
                    await fetch('/api/profile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: authData.user!.id,
                            email: formData.email,
                            fullName: formData.fullName,
                        }),
                    });
                } catch {}

                window.location.href = '/dashboard';
                return;
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (signInError) {
                    setError(signInError.message);
                    setIsLoading(false);
                    return;
                }

                if (!data.session) {
                    setError('Login succeeded but no session was created. Please check your email verification.');
                    setIsLoading(false);
                    return;
                }

                try {
                    const { data: profile } = await supabase.from('users').select('role').eq('id', data.user!.id).single();
                    if (profile?.role === 'admin') {
                        document.cookie = "user-role=admin; path=/; max-age=86400";
                        window.location.href = '/admin';
                        return;
                    } else {
                        document.cookie = "user-role=user; path=/; max-age=86400";
                    }
                } catch (e) {
                    document.cookie = "user-role=user; path=/; max-age=86400";
                }

                window.location.href = '/dashboard';
                return;
            }
        } catch (err: any) {
            setError(err?.message || 'An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-textMain flex items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-2xl border border-border bg-surface overflow-hidden shadow-elevated flex flex-col md:flex-row">

                {/* Left Identity Panel — Deep Olive (#20382B) */}
                <div className="md:w-5/12 bg-[#20382B] text-[#F8F4EB] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D6A52C] text-[#20382B] font-black">
                                <Shield className="h-5 w-5 fill-[#20382B]" />
                            </div>
                            <div>
                                <span className="font-mono-tech text-xs text-[#D6A52C] uppercase tracking-widest block leading-none">MISSION</span>
                                <span className="text-xl font-black text-white tracking-wider block">0500</span>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-serif-quote font-bold text-white mb-2 leading-tight">
                            Personal Command Center
                        </h1>
                        <p className="text-xs text-white/70 font-medium leading-relaxed mb-6">
                            Discipline. Execution. Ambition. Conquering difficult targets every single morning.
                        </p>
                    </div>

                    <div className="relative z-10 border-t border-white/10 pt-6">
                        <blockquote className="text-base font-serif-quote italic text-white/90 leading-relaxed mb-2">
                            &ldquo;Yeh Dil Maange Uniform!&rdquo;
                        </blockquote>
                        <span className="font-mono-tech text-[10px] font-bold text-[#D6A52C] uppercase tracking-widest block">
                            — Captain Vikram Batra, PVC
                        </span>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="md:w-7/12 p-8 md:p-10 bg-surface flex flex-col justify-center">
                    <div className="mb-6">
                        <span className="font-mono-tech text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">
                            {isForgotPassword ? 'PASSWORD RECOVERY' : isSignUp ? 'ENLISTMENT' : 'AUTHENTICATION'}
                        </span>
                        <h2 className="text-2xl font-black text-textMain tracking-tight">
                            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Command Account' : 'Sign In to Command Center'}
                        </h2>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-xl bg-danger/10 border border-danger/20 p-3 text-xs text-danger font-medium">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 rounded-xl bg-success/10 border border-success/20 p-3 text-xs text-success font-medium">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp && (
                            <Input
                                label="Full Name"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                            />
                        )}

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            required
                        />

                        {!isForgotPassword && (
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                required
                            />
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            className="w-full py-3"
                        >
                            {isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
                        </Button>
                    </form>

                    {!isSignUp && !isForgotPassword && (
                        <div className="mt-3 text-right">
                            <button
                                type="button"
                                onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMessage(''); }}
                                className="text-xs text-textMuted hover:text-accent transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-textMuted">
                            {isForgotPassword ? 'Remember password?' : isSignUp ? 'Already enroled?' : 'New operator?'}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(isForgotPassword ? false : !isSignUp);
                                setIsForgotPassword(false);
                                setError('');
                                setSuccessMessage('');
                                setFormData({ email: '', password: '', fullName: '' });
                            }}
                            className="font-bold text-accent hover:underline uppercase tracking-wide"
                        >
                            {isForgotPassword ? 'Back to Sign In' : isSignUp ? 'Sign In' : 'Enlist Now'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
