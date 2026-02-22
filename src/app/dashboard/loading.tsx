export default function DashboardLoading() {
    return (
        <div className="flex h-screen flex-col bg-[#0B1D13] text-[#E8E8E8] lg:flex-row">
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b border-[#1E3A2A] bg-[#162B20] px-6 py-4">
                    <div className="h-8 w-48 animate-pulse rounded bg-[#1E3A2A]" />
                </div>
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                    <div className="mx-auto max-w-7xl px-4 py-6 space-y-8">
                        {/* Rank skeleton */}
                        <div className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-8 text-center">
                            <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-[#1E3A2A]" />
                            <div className="mx-auto mt-4 h-6 w-32 animate-pulse rounded bg-[#1E3A2A]" />
                            <div className="mx-auto mt-2 h-10 w-48 animate-pulse rounded bg-[#1E3A2A]" />
                        </div>
                        {/* Stats grid skeleton */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6">
                                    <div className="h-4 w-24 animate-pulse rounded bg-[#1E3A2A]" />
                                    <div className="mt-4 h-8 w-16 animate-pulse rounded bg-[#1E3A2A]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
