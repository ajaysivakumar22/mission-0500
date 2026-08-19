import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/Skeletons';

export default function MedalsLoading() {
    return (
        <MainLayout disableTransitionLine>
            <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <Skeleton className="h-8 w-44 rounded-lg" />
                    <Skeleton className="h-4 w-72 rounded-md" />
                </div>
                <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="card p-6 flex flex-col items-center space-y-3">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <Skeleton className="h-4 w-20 rounded-md" />
                            <Skeleton className="h-3 w-24 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
