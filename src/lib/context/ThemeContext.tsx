'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'operator' | 'scholar' | 'athlete' | 'protagonist';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeType>('operator');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Read from localStorage on mount so it doesn't SSR mismatch
        const storedTheme = localStorage.getItem('mission_0500_theme') as ThemeType;
        if (storedTheme) {
            setThemeState(storedTheme);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Apply theme via CSS class on the body tag
        document.body.className = '';
        if (theme !== 'operator') {
            document.body.classList.add(`theme-${theme}`);
        }

        // Sync with local storage
        localStorage.setItem('mission_0500_theme', theme);
    }, [theme, mounted]);

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
