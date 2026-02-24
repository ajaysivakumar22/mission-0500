'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signUp, signIn } from '@/server/actions/auth';

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

                // If we reach here, signUp didn't redirect (meaning it failed or returned an error obj, or email confirmation is required)
                if (result && result.success) {
                    if (result.data?.emailConfirmationRequired) {
                        setSuccessMessage('Account created! Please check your email to confirm your account before logging in.');
                        setIsLoading(false);
                        return;
                    }
                } else if (result && !result.success) {
                    setError(result.error || 'An error occurred during signup');
                    setIsLoading(false);
                }
            } else {
                // Server-side Sign In
                const result = await signIn(formData.email, formData.password);

                // If we reach here, signIn didn't redirect (meaning it failed or returned an error obj)
                if (result && !result.success) {
                    setError(result.error || 'Invalid credentials');
                    setIsLoading(false);
                    return;
                }
            }
        } catch (err: any) {
            // NEXT_REDIRECT errors are expected and should be thrown so Next can handle the redirect
            if (err.message && err.message.includes('NEXT_REDIRECT')) {
                throw err;
            }
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544893700-1c759530db8f?q=80&w=2670&auto=format&fit=crop")' }}
            >
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-[#0B1D13]/80 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 max-w-7xl mx-auto lg:flex-row lg:gap-16">

                {/* Motivational Left Side (Visible primarily on desktop but stacks on mobile) */}
                <div className="mb-12 text-center lg:mb-0 lg:w-1/2 lg:text-left">
                    <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#9CA3AF] tracking-tight drop-shadow-lg mb-4">
                        MISSION<br /><span className="text-[#FFD60A]">0500</span>
                    </h1>
                    <p className="mt-4 text-xl text-[#E8E8E8] font-medium tracking-wide max-w-lg mx-auto lg:mx-0">
                        Personal Discipline Command Center
                    </p>

                    <div className="mt-8 lg:mt-16 hidden lg:block">
                        <blockquote className="text-3xl font-serif italic text-white leading-relaxed mb-4 text-shadow-sm border-l-4 border-[#FFD60A] pl-6">
                            &quot;Yeh Dil Maange More!&quot;
                        </blockquote>
                        <span className="text-xl font-bold text-[#FFD60A] tracking-widest uppercase drop-shadow-md ml-6 block">
                            — Captain Vikram Batra
                        </span>
                    </div>
                </div>

                {/* Login Card Right Side */}
                <div className="w-full max-w-md lg:w-1/2 rounded-2xl border border-white/10 bg-[#0B1D13]/60 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-white/20">
                    <div className="lg:hidden mb-8 text-center">
                        <blockquote className="text-xl font-serif italic text-white leading-relaxed mb-2 text-shadow-sm">
                            &quot;Yeh Dil Maange More!&quot;
                        </blockquote>
                        <span className="text-sm font-bold text-[#FFD60A] tracking-widest uppercase">
                            — Captain Vikram Batra
                        </span>
                    </div>

                    <h2 className="mb-6 text-center text-3xl font-black text-white tracking-tight uppercase">
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
                            className="mt-2 text-[#FFD60A] hover:text-white transition-colors font-bold tracking-wide uppercase text-sm"
                        >
                            {isSignUp ? 'Proceed to Sign In' : 'Initiate Enlistment (Sign Up)'}
                        </button>
                    </div>
                </div>

            </div>

            {/* Footer Info */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-10 w-full">
                <p className="text-xs text-white/50 tracking-widest uppercase font-semibold">
                    Touch the Sky with Glory
                </p>
            </div>
        </div>
    );
}
