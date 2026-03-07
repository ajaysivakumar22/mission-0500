export default function MedalsLoading() {
    return (
        <div className="flex h-screen flex-col bg-[#0B1D13] text-[#E8E8E8]">
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b border-[#1E3A2A] bg-[#162B20] px-6 py-4">
                    <div className="h-8 w-48 animate-pulse rounded bg-[#1E3A2A]" />
                </div>
                <main className="flex-1 overflow-y-auto pb-32">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                        <div className="h-8 w-44 animate-pulse rounded bg-[#1E3A2A]" />
                        <div className="h-4 w-72 animate-pulse rounded bg-[#1E3A2A]" />
                        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6 space-y-3">
                                    <div className="h-16 w-16 animate-pulse rounded-full bg-[#1E3A2A]" />
                                    <div className="h-4 w-20 animate-pulse rounded bg-[#1E3A2A]" />
                                    <div className="h-3 w-24 animate-pulse rounded bg-[#1E3A2A]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
