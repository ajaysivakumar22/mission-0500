import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/Skeletons';

export default function ReportLoading() {
    return (
        <MainLayout disableTransitionLine>
            <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <Skeleton className="h-8 w-52 rounded-lg" />
                    <Skeleton className="h-8 w-32 rounded-lg" />
                </div>
                <div className="card p-6 space-y-5">
                    <Skeleton className="h-5 w-40 rounded-md" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-5 w-36 rounded-md" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                </div>
            </div>
        </MainLayout>
    );
}
