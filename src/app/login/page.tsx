'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signUp } from '@/server/actions/auth';

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    const supabase = createClient();

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

        try {
            if (isSignUp) {
                if (!formData.fullName.trim()) {
                    setError('Full name is required');
                    setIsLoading(false);
                    return;
                }
                const result = await signUp(formData.email, formData.password, formData.fullName);

                if (result.success) {
                    if (result.data?.emailConfirmationRequired) {
                        setSuccessMessage('Account created! Please check your email to confirm your account before logging in.');
                        setIsLoading(false);
                        return;
                    }
                    // For signup success (immediate login case), we still rely on server action's session
                    setSuccessMessage('Success! Redirecting to dashboard...');
                    router.refresh(); // Refresh server components to see new session
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 1000);
                } else {
                    setError(result.error || 'An error occurred during signup');
                    setIsLoading(false);
                }
            } else {
                // Client-side Sign In
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) {
                    setError(error.message || 'Invalid credentials');
                    setIsLoading(false);
                    return;
                }

                setSuccessMessage('Success! Redirecting to dashboard...');
                router.refresh(); // Refresh server components to see new session
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1D13] px-4">
            {/* Logo */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-[#FFD60A]">MISSION 0500</h1>
                <p className="mt-2 text-[#9CA3AF]">Personal Discipline Command Center</p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md rounded-xl border border-[#1E3A2A] bg-[#162B20] p-8">
                <h2 className="mb-6 text-center text-2xl font-bold text-[#E8E8E8]">
                    {isSignUp ? 'Join the Mission' : 'Command Center'}
                </h2>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-900 p-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 rounded-lg bg-green-900 p-3 text-sm text-green-200 font-medium animate-pulse">
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

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        {isSignUp ? 'Create Account' : 'Login'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[#9CA3AF]">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                            setFormData({ email: '', password: '', fullName: '' });
                        }}
                        className="mt-2 text-[#FFD60A] hover:text-[#FFE366] font-medium"
                    >
                        {isSignUp ? 'Sign In' : 'Create Account'}
                    </button>
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 max-w-md text-center">
                <p className="text-xs text-[#6B7280]">
                    MISSION 0500 is a personal discipline tracking system.
                    Your data is secure and private.
                </p>
            </div>
        </div>
    );
}
