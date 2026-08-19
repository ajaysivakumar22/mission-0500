import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/Skeletons';

export default function SettingsLoading() {
    return (
        <MainLayout disableTransitionLine>
            <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <Skeleton className="h-8 w-36 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
                <div className="card p-6 space-y-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-28 rounded-md" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
