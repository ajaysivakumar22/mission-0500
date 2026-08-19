import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/Skeletons';

export default function GoalsLoading() {
    return (
        <MainLayout disableTransitionLine>
            <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <Skeleton className="h-8 w-44 rounded-lg" />
                    <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card p-6 space-y-4">
                            <Skeleton className="h-5 w-3/4 rounded-md" />
                            <Skeleton className="h-3 w-full rounded-md" />
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
