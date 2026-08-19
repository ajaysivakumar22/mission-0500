import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div 
            className={`bg-surface-muted animate-pulse rounded-lg ${className}`}
            style={{ animationDuration: '1.5s' }}
        />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-slide-in">
            {/* Page Header Skeleton */}
            <div className="mb-8">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-80" />
            </div>

            {/* Top Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Skeleton className="h-24 w-full card" />
                <Skeleton className="h-24 w-full card" />
                <Skeleton className="h-24 w-full card" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-48 w-full card" />
                    <Skeleton className="h-48 w-full card" />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Skeleton className="h-[280px] w-full card" />
                </div>
            </div>
        </div>
    );
}

export function RoutineSkeleton() {
    return (
        <div className="space-y-3 animate-slide-in">
            <Skeleton className="h-14 w-full card" />
            <Skeleton className="h-14 w-full card" />
            <Skeleton className="h-14 w-full card" />
            <Skeleton className="h-14 w-full card" />
        </div>
    );
}

export function TaskSkeleton() {
    return (
        <div className="space-y-3 animate-slide-in mt-6">
            <Skeleton className="h-14 w-full card" />
            <Skeleton className="h-14 w-full card" />
            <Skeleton className="h-14 w-full card" />
        </div>
    );
}
