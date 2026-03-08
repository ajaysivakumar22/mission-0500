'use client';

import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
    const handleLogout = () => {
        document.cookie.split(';').forEach((c) => {
            const name = c.split('=')[0].trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
        window.location.href = '/login';
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-bold text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Logout
        </button>
    );
}
