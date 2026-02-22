'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
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
            <div className="max-w-2xl space-y-8">
                {/* Profile Section */}
                <div className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6">
                    <h2 className="mb-6 text-xl font-bold text-[#E8E8E8]">Profile Settings</h2>

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
                <div className="rounded-xl border border-red-800 bg-red-900/20 p-6">
                    <h2 className="mb-4 text-lg font-bold text-red-200">Danger Zone</h2>
                    <p className="mb-4 text-sm text-red-300">
                        Once you sign out, you&apos;ll need to sign in again to access your account.
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
