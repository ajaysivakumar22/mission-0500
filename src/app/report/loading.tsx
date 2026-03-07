export default function ReportLoading() {
    return (
        <div className="flex h-screen flex-col bg-[#0B1D13] text-[#E8E8E8]">
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b border-[#1E3A2A] bg-[#162B20] px-6 py-4">
                    <div className="h-8 w-48 animate-pulse rounded bg-[#1E3A2A]" />
                </div>
                <main className="flex-1 overflow-y-auto pb-32">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                        <div className="h-8 w-52 animate-pulse rounded bg-[#1E3A2A]" />
                        <div className="h-4 w-80 animate-pulse rounded bg-[#1E3A2A]" />
                        <div className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6 space-y-5">
                            <div className="h-5 w-40 animate-pulse rounded bg-[#1E3A2A]" />
                            <div className="h-32 w-full animate-pulse rounded-lg bg-[#1E3A2A]" />
                            <div className="h-5 w-36 animate-pulse rounded bg-[#1E3A2A]" />
                            <div className="h-32 w-full animate-pulse rounded-lg bg-[#1E3A2A]" />
                            <div className="h-10 w-full animate-pulse rounded-lg bg-[#1E3A2A]" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
