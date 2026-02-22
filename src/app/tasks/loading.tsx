export default function RouteLoading() {
    return (
        <div className="flex h-screen flex-col bg-[#0B1D13] text-[#E8E8E8] lg:flex-row">
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b border-[#1E3A2A] bg-[#162B20] px-6 py-4">
                    <div className="h-8 w-48 animate-pulse rounded bg-[#1E3A2A]" />
                </div>
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                    <div className="mx-auto max-w-7xl px-4 py-6 space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="h-5 w-56 animate-pulse rounded bg-[#1E3A2A]" />
                                        <div className="h-3 w-32 animate-pulse rounded bg-[#1E3A2A]" />
                                    </div>
                                    <div className="h-6 w-16 animate-pulse rounded bg-[#1E3A2A]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
