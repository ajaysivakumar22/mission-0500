export default function TasksLoading() {
    return (
        <div className="flex h-screen flex-col bg-[#0B1D13] text-[#E8E8E8]">
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b border-[#1E3A2A] bg-[#162B20] px-6 py-4">
                    <div className="h-8 w-48 animate-pulse rounded bg-[#1E3A2A]" />
                </div>
                <main className="flex-1 overflow-y-auto pb-32">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="h-8 w-44 animate-pulse rounded bg-[#1E3A2A]" />
                            <div className="h-10 w-32 animate-pulse rounded-lg bg-[#1E3A2A]" />
                        </div>
                        <div className="h-4 w-64 animate-pulse rounded bg-[#1E3A2A]" />
                        <div className="space-y-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 rounded-xl border border-[#1E3A2A] bg-[#162B20] p-5">
                                    <div className="h-5 w-5 animate-pulse rounded bg-[#1E3A2A]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 animate-pulse rounded bg-[#1E3A2A]" />
                                        <div className="h-3 w-1/2 animate-pulse rounded bg-[#1E3A2A]" />
                                    </div>
                                    <div className="h-6 w-20 animate-pulse rounded-full bg-[#1E3A2A]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
