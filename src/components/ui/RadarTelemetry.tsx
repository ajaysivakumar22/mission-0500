'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarTelemetryProps {
    data: {
        subject: string;
        A: number;
        fullMark: number;
    }[];
}

export function RadarTelemetry({ data }: RadarTelemetryProps) {
    return (
        <div className="h-[300px] w-full relative">
            {/* Holographic scanning effect overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(11,29,19,0.8)_100%)] z-10"></div>
                <div className="w-full h-full animate-[spin_10s_linear_infinite] opacity-20 bg-[conic-gradient(from_0deg_at_50%_50%,_rgba(255,214,10,0)_0deg,_rgba(255,214,10,0.4)_30deg,_rgba(255,214,10,0)_60deg)]"></div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#1E3A2A" strokeDasharray="3 3" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#FFD60A', fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar
                        name="Aspirant"
                        dataKey="A"
                        stroke="#FFD60A"
                        strokeWidth={2}
                        fill="#FFD60A"
                        fillOpacity={0.3}
                        isAnimationActive={true}
                        animationBegin={200}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
