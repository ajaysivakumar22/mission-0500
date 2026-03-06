'use client';

import { useState } from 'react';
import {
    Users, MessageSquare, BarChart3, TrendingUp, IndianRupee, ShieldAlert,
    Target, Activity, Zap, Search
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

interface Props {
    initialUsers: any[];
    initialFeedbacks: any[];
    initialSubscriptions: any[];
    totalUsers: number;
    totalRevenue: number;
    totalSubscriptions: number;
    userGrowthData: any[];
    revenueData: any[];
}

export default function AdminDashboardClient({
    initialUsers = [],
    initialFeedbacks = [],
    initialSubscriptions = [],
    totalUsers = 0,
    totalRevenue = 0,
    totalSubscriptions = 0,
    userGrowthData = [],
    revenueData = [],
}: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'feedback'>('overview');
    const [searchQuery, setSearchQuery] = useState('');

    const safeUsers = Array.isArray(initialUsers) ? initialUsers : [];
    const safeFeedbacks = Array.isArray(initialFeedbacks) ? initialFeedbacks : [];
    const safeSubs = Array.isArray(initialSubscriptions) ? initialSubscriptions : [];
    const safeGrowth = Array.isArray(userGrowthData) ? userGrowthData : [];
    const safeRevenue = Array.isArray(revenueData) ? revenueData : [];

    const filteredUsers = safeUsers.filter((u: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const emailMatch = u?.email ? String(u.email).toLowerCase().includes(q) : false;
        const nameMatch = u?.full_name ? String(u.full_name).toLowerCase().includes(q) : false;
        return emailMatch || nameMatch;
    });

    const getBtnClass = (isActive: boolean) => isActive
        ? 'bg-primary text-textMain shadow-[0_0_15px_rgba(34,197,94,0.3)]'
        : 'text-textMuted hover:bg-surface';

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold uppercase">Active</span>;
            case 'canceled': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold uppercase">Canceled</span>;
            case 'past_due': return <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-bold uppercase">Past Due</span>;
            case 'trialing': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold uppercase">Trial</span>;
            default: return <span className="bg-white/10 text-textMuted px-2 py-1 rounded text-xs font-bold uppercase">{status}</span>;
        }
    };

    const tierPrices: Record<string, number> = { pro: 999, team: 4999 };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Tabs */}
            <div className="flex flex-wrap gap-3 border-b border-border pb-4">
                <button onClick={() => setActiveTab('overview')} className={"flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-colors " + getBtnClass(activeTab === 'overview')}>
                    <BarChart3 className="w-5 h-5" /> HQ Overview
                </button>
                <button onClick={() => setActiveTab('revenue')} className={"flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-colors " + getBtnClass(activeTab === 'revenue')}>
                    <IndianRupee className="w-5 h-5" /> Monetization
                </button>
                <button onClick={() => setActiveTab('users')} className={"flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-colors " + getBtnClass(activeTab === 'users')}>
                    <Users className="w-5 h-5" /> Personnel
                </button>
                <button onClick={() => setActiveTab('feedback')} className={"flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-colors " + getBtnClass(activeTab === 'feedback')}>
                    <MessageSquare className="w-5 h-5" /> Transmissions
                    {safeFeedbacks.length > 0 && (
                        <span className="bg-accent text-black text-xs px-2 py-0.5 rounded-full font-bold">{safeFeedbacks.length}</span>
                    )}
                </button>
            </div>

            {/* ===================== OVERVIEW TAB ===================== */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        <div className="bg-gradient-to-br from-surface to-background border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><Users className="w-20 h-20" /></div>
                            <h3 className="text-textMuted font-bold uppercase text-xs tracking-widest mb-2">Total Operatives</h3>
                            <p className="text-4xl font-black text-white">{totalUsers}</p>
                        </div>
                        <div className="bg-gradient-to-br from-surface to-background border border-accent/20 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><IndianRupee className="w-20 h-20" /></div>
                            <h3 className="text-accent font-bold uppercase text-xs tracking-widest mb-2">Total Revenue</h3>
                            <p className="text-4xl font-black text-white">{totalRevenue > 0 ? '\u20B9' + totalRevenue.toLocaleString('en-IN') : '\u20B90'}</p>
                        </div>
                        <div className="bg-gradient-to-br from-surface to-background border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><Zap className="w-20 h-20" /></div>
                            <h3 className="text-textMuted font-bold uppercase text-xs tracking-widest mb-2">Active Subscriptions</h3>
                            <p className="text-4xl font-black text-white">{totalSubscriptions}</p>
                        </div>
                        <div className="bg-gradient-to-br from-surface to-background border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><MessageSquare className="w-20 h-20" /></div>
                            <h3 className="text-textMuted font-bold uppercase text-xs tracking-widest mb-2">Pending Feedback</h3>
                            <p className="text-4xl font-black text-white">{safeFeedbacks.length}</p>
                            {safeFeedbacks.length > 0 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Requires Action</p>}
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-surface/50 border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Activity className="text-primary w-5 h-5" /> User Signups
                            </h3>
                            {safeGrowth.length > 0 ? (
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={safeGrowth}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0B1D13', borderColor: '#1E3A2A', borderRadius: '8px' }} itemStyle={{ color: '#22C55E', fontWeight: 'bold' }} />
                                            <Bar dataKey="users" fill="#22C55E" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-textMuted">No signup data available yet.</div>
                            )}
                        </div>

                        <div className="bg-surface/50 border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="text-accent w-5 h-5" /> Revenue (INR)
                            </h3>
                            {safeRevenue.length > 0 ? (
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={safeRevenue}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#FFD60A" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#FFD60A" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val: number) => '\u20B9' + (val / 1000) + 'k'} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0B1D13', borderColor: '#FFD60A', borderRadius: '8px' }} itemStyle={{ color: '#FFD60A', fontWeight: 'bold' }} formatter={(value: any) => ['\u20B9' + Number(value || 0).toLocaleString('en-IN'), 'Revenue']} />
                                            <Area type="monotone" dataKey="amount" stroke="#FFD60A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-textMuted">No revenue data available yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== MONETIZATION TAB ===================== */}
            {activeTab === 'revenue' && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-[#0B1D13] to-surface border border-accent/20 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Financial Command Center</h2>
                            <p className="text-textMuted">Real-time subscription data from the database.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-accent uppercase tracking-widest">Gross Volume</p>
                            <p className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,214,10,0.3)]">
                                {'\u20B9'}{totalRevenue.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface/50 border border-white/10 p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Target className="w-5 h-5 text-accent" /> Subscriptions</h2>
                            <span className="text-sm text-textMuted">{safeSubs.length} total</span>
                        </div>
                        {safeSubs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-background">
                                        <tr>
                                            <th className="p-4 font-bold text-textMuted uppercase">Operative</th>
                                            <th className="p-4 font-bold text-textMuted uppercase">Tier</th>
                                            <th className="p-4 font-bold text-textMuted uppercase">Amount</th>
                                            <th className="p-4 font-bold text-textMuted uppercase">Status</th>
                                            <th className="p-4 font-bold text-textMuted uppercase">Subscribed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {safeSubs.map((sub: any, i: number) => {
                                            const email = sub.users?.email ? sub.users.email : 'Unknown';
                                            const price = tierPrices[sub.tier] || 0;
                                            const date = sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-IN') : '-';
                                            return (
                                                <tr key={sub.id ? sub.id : 'sub-' + i} className="border-t border-border/50 hover:bg-white/5 transition-colors">
                                                    <td className="p-4 text-white">{email}</td>
                                                    <td className="p-4"><span className="text-accent font-bold uppercase">{sub.tier}</span></td>
                                                    <td className="p-4">{'\u20B9'}{price.toLocaleString('en-IN')}</td>
                                                    <td className="p-4">{getStatusBadge(sub.status)}</td>
                                                    <td className="p-4 text-textMuted">{date}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <IndianRupee className="w-12 h-12 text-textMuted mx-auto mb-4 opacity-30" />
                                <p className="text-textMuted text-lg">No subscriptions yet.</p>
                                <p className="text-textMuted text-sm mt-1">Revenue data will appear here once users subscribe.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===================== USERS TAB ===================== */}
            {activeTab === 'users' && (
                <div className="bg-surface/50 border border-white/10 p-6 rounded-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-bold">Personnel Roster</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
                            <input
                                type="text"
                                placeholder="Search operatives..."
                                className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary w-full sm:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    {filteredUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="p-4 font-bold text-textMuted uppercase">Email</th>
                                        <th className="p-4 font-bold text-textMuted uppercase">Name</th>
                                        <th className="p-4 font-bold text-textMuted uppercase">Joined</th>
                                        <th className="p-4 font-bold text-textMuted uppercase">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user: any, index: number) => (
                                        <tr key={user.id ? user.id : 'user-' + index} className="border-t border-border/50 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-white">{user.email ? user.email : 'N/A'}</td>
                                            <td className="p-4 text-white">{user.full_name ? user.full_name : '-'}</td>
                                            <td className="p-4 text-textMuted">{user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '-'}</td>
                                            <td className="p-4">
                                                {user.role === 'admin' ? (
                                                    <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Commander</span>
                                                ) : (
                                                    <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Operative</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <Users className="w-12 h-12 text-textMuted mx-auto mb-4 opacity-30" />
                            <p className="text-textMuted text-lg">{searchQuery ? 'No personnel match your search.' : 'No users registered yet.'}</p>
                        </div>
                    )}
                </div>
            )}

            {/* ===================== FEEDBACK TAB ===================== */}
            {activeTab === 'feedback' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-surface/50 border border-white/10 p-4 rounded-xl">
                        <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Inbound Transmissions</h2>
                        <span className="text-sm text-textMuted">{safeFeedbacks.length} total</span>
                    </div>

                    {safeFeedbacks.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {safeFeedbacks.map((fb: any, index: number) => (
                                <div key={fb.id ? fb.id : 'fb-' + index} className="bg-surface/50 border border-white/10 p-6 rounded-xl flex flex-col gap-4 group hover:border-primary/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold px-3 py-1 rounded bg-primary/20 text-primary uppercase tracking-widest">
                                            {fb.category ? fb.category : 'general'}
                                        </span>
                                        <span className="text-xs text-textMuted">
                                            {fb.created_at ? new Date(fb.created_at).toLocaleDateString('en-IN') : '-'}
                                        </span>
                                    </div>
                                    <p className="text-white text-lg leading-relaxed">{fb.message ? fb.message : 'No content'}</p>
                                    <div className="mt-auto pt-4 border-t border-border/50 text-sm text-textMuted">
                                        Operative ID: <span className="font-mono text-xs">{fb.user_id ? String(fb.user_id).substring(0, 8) + '...' : 'Unknown'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-surface/50 border border-dashed border-white/20 p-16 text-center rounded-xl">
                            <MessageSquare className="w-12 h-12 text-textMuted mx-auto mb-4 opacity-30" />
                            <p className="text-textMuted text-lg">No transmissions received yet.</p>
                            <p className="text-textMuted text-sm mt-1">User feedback will appear here when submitted.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
