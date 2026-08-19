import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/Skeletons';

export default function RoutineLoading() {
    return (
        <MainLayout disableTransitionLine>
            <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="card p-4 flex items-center gap-4">
                            <Skeleton className="h-5 w-5 rounded-md" />
                            <Skeleton className="h-4 flex-1 rounded-md" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
