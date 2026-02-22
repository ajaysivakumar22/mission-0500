interface StatCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function StatCard({ label, value, unit, icon, className = '' }: StatCardProps) {
    return (
        <div className={`rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-[#9CA3AF]">{label}</p>
                    <p className="mt-2 text-3xl font-bold text-[#FFD60A]">
                        {value}
                        {unit && <span className="text-lg">{unit}</span>}
                    </p>
                </div>
                {icon && <div className="text-[#1B4332]">{icon}</div>}
            </div>
        </div>
    );
}
