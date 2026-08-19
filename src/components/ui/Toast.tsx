'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        return { toast: (_message: string) => { /* fallback for out-of-provider components */ } };
    }
    return context;
}

const icons: Record<ToastType, typeof CheckCircle2> = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colors: Record<ToastType, string> = {
    success: 'border-success/30 bg-surface text-textMain shadow-elevated',
    error:   'border-danger/30 bg-surface text-textMain shadow-elevated',
    warning: 'border-warning/30 bg-surface text-textMain shadow-elevated',
    info:    'border-accent/30 bg-surface text-textMain shadow-elevated',
};

const iconColors: Record<ToastType, string> = {
    success: 'text-success',
    error:   'text-danger',
    warning: 'text-warning',
    info:    'text-accent',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const Icon = icons[toast.type];

    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), 4000);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <div
            className={`flex items-start gap-3 rounded-card border px-4 py-3 shadow-card animate-slide-up transition-all ${colors[toast.type]}`}
            role="alert"
        >
            <Icon className={`h-4.5 w-4.5 mt-0.5 flex-shrink-0 ${iconColors[toast.type]}`} />
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="flex-shrink-0 rounded p-1 text-textMuted hover:text-textMain hover:bg-surface-muted transition-colors"
                aria-label="Dismiss notification"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            {/* Toast container — fixed bottom-right (bottom center on mobile) */}
            <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 w-[340px] max-w-[calc(100vw-2.5rem)] pointer-events-none [&>*]:pointer-events-auto">
                {toasts.map(t => (
                    <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
