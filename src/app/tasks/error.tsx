'use client';

export default function RouteError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-[#0B1D13] px-4">
            <div className="w-full max-w-md rounded-xl border border-red-800 bg-[#162B20] p-8 text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Something went wrong</h2>
                <p className="text-[#9CA3AF] text-sm mb-6">
                    {error.message || 'An unexpected error occurred.'}
                </p>
                <button
                    onClick={reset}
                    className="rounded-lg bg-[#FFD60A] px-6 py-3 font-medium text-[#0B1D13] hover:bg-[#FFE366] transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
