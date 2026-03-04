'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateUserProfile, signOut } from '@/server/actions/auth';
import { updateUserSettings } from '@/server/actions/settings';
import { LogOut, Save, ShieldAlert } from 'lucide-react';

interface SettingsClientProps {
    userId: string;
    fullName: string;
    email: string;
    initialStrictMode: boolean;
}

export default function SettingsClient({ userId, fullName, email, initialStrictMode }: SettingsClientProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [strictMode, setStrictMode] = useState(initialStrictMode);
    const [formData, setFormData] = useState({
        full_name: fullName,
        email: email,
    });

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const result = await updateUserProfile(userId, formData.full_name);
            const settingsResult = await updateUserSettings(userId, { strict_mode: strictMode });

            if (result.success && settingsResult.success) {
                alert('Profile & Settings updated successfully');
            } else {
                alert(result.error || settingsResult.error || 'Failed to update system');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <MainLayout>
            <div className="w-full space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    title="Configuration Protocol"
                    subtitle="Manage your identity. True power comes from knowing yourself."
                />

                <InspirationalQuote
                    quote="Those who cannot acknowledge themselves will eventually fail."
                    author="Itachi Uchiha"
                    bgImageUrl="https://images.unsplash.com/photo-1518774780287-f823f669e46a?q=80&w=2670&auto=format&fit=crop"
                />

                {/* Profile Section */}
                <div className="rounded-2xl border border-white/10 bg-[#162B20]/80 p-8 backdrop-blur-md shadow-lg">
                    <h2 className="mb-6 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#9CA3AF] uppercase tracking-wide">Officer Profile</h2>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <Input
                            label="Full Name"
                            value={formData.full_name}
                            onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            disabled
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSaving}
                            className="gap-2"
                        >
                            <Save className="h-5 w-5" />
                            Save Changes
                        </Button>
                    </form>
                </div>

                {/* Accountability Protocols */}
                <div className="rounded-2xl border border-[#FFD60A]/30 bg-[#162B20]/80 p-8 backdrop-blur-md shadow-lg transition-all hover:border-[#FFD60A]/50">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldAlert className={`h-6 w-6 ${strictMode ? 'text-red-500' : 'text-[#FFD60A]'}`} />
                                <h2 className="text-xl font-black text-[#E8E8E8] uppercase tracking-wide">
                                    Strict Accountability Mode
                                </h2>
                            </div>
                            <p className="max-w-xl text-sm font-medium text-[#9CA3AF] mb-6">
                                Enabling Strict Mode introduces severe consequences for failure. Breaking a routine streak will deal massive XP damage. This mode is only for aspirants seeking absolute discipline.
                            </p>
                        </div>

                        {/* Toggle Switch UI */}
                        <div
                            onClick={() => setStrictMode(!strictMode)}
                            className={`relative inline-flex h-8 w-16 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:ring-offset-2 focus:ring-offset-[#0B1D13] ${strictMode ? 'bg-red-600' : 'bg-gray-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition duration-300 ${strictMode ? 'translate-x-9' : 'translate-x-1'
                                    } shadow-md`}
                            />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-2xl border border-red-500/30 bg-red-900/10 p-8 backdrop-blur-md shadow-lg transition-all hover:border-red-500/50">
                    <h2 className="mb-4 text-xl font-black text-red-400 uppercase tracking-wide">Danger Zone</h2>
                    <p className="mb-6 text-sm text-red-300 font-medium">
                        Once you sign out, you&apos;ll need to establish clearance again.
                    </p>
                    <form action={async () => { await signOut(); }}>
                        <Button
                            type="submit"
                            variant="danger"
                            className="gap-2"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
