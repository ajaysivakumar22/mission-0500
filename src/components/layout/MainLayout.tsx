import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { DynamicMotivationWidget } from '@/components/ui/DynamicMotivationWidget';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

interface MainLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
}

export function MainLayout({ children, showHeader = true }: MainLayoutProps) {
    const [widgetPosition, setWidgetPosition] = useState({ x: 0, y: 0 });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px movement required before dragging starts (allows clicks to pass through)
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { delta } = event;
        setWidgetPosition(prev => ({
            x: prev.x + delta.x,
            y: prev.y + delta.y
        }));
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex h-screen flex-col bg-[#051009] text-[#E8E8E8] lg:flex-row relative">
                {/* Global Background Elements for Military Premium Feel */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B4332]/20 via-transparent to-transparent opacity-60 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#051009] via-transparent to-transparent opacity-90"></div>
                </div>

                {/* Navigation */}
                <div className="z-10 relative">
                    <Navigation />
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-hidden z-10 relative">
                    {showHeader && <Header />}

                    {/* Scrollable Content */}
                    <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                        <div className="mx-auto max-w-7xl px-4 py-6">
                            {children}
                        </div>
                    </main>
                </div>

                {/* Persistent Vision Board Widget */}
                <DynamicMotivationWidget defaultPosition={widgetPosition} />
            </div>
        </DndContext>
    );
}
