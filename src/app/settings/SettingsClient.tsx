'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { InspirationalQuote } from '@/components/ui/InspirationalQuote';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateUserProfile, signOut } from '@/server/actions/auth';
import { LogOut, Save } from 'lucide-react';

interface SettingsClientProps {
    userId: string;
    fullName: string;
    email: string;
}

export default function SettingsClient({ userId, fullName, email }: SettingsClientProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: fullName,
        email: email,
    });

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const result = await updateUserProfile(userId, formData.full_name);

            if (result.success) {
                alert('Profile updated successfully');
            } else {
                alert(result.error || 'Failed to update profile');
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
