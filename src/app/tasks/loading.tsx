import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/Skeletons';

export default function TasksLoading() {
    return (
        <MainLayout disableTransitionLine>
            <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="card p-5 flex items-center gap-4">
                            <Skeleton className="h-5 w-5 rounded-md" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4 rounded-md" />
                                <Skeleton className="h-3 w-1/2 rounded-md" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
