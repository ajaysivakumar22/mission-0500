/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                // Maps to --font-inter CSS variable set by next/font in layout.tsx
                sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont',
                       'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            colors: {
                // ── Core surfaces ──────────────────────────────────────
                background:       'var(--theme-background)',
                surface:          'var(--theme-surface)',
                'surface-muted':  'var(--theme-surface-muted)',
                primary:          'var(--theme-primary)',
                // ── Accent ─────────────────────────────────────────────
                accent:           'var(--theme-accent)',
                'accent-muted':   'var(--theme-accent-muted)',
                // ── Borders ────────────────────────────────────────────
                border:           'var(--theme-border)',
                // ── Text ───────────────────────────────────────────────
                textMain:         'var(--theme-text-main)',
                textSecondary:    'var(--theme-text-secondary)',
                textMuted:        'var(--theme-text-muted)',
                // ── Semantic states ────────────────────────────────────
                success:          'var(--theme-success)',
                warning:          'var(--theme-warning)',
                danger:           'var(--theme-danger)',
            },
            fontSize: {
                xs:   ['0.75rem',  { lineHeight: '1rem'    }],
                sm:   ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['1rem',     { lineHeight: '1.6rem'  }],
                lg:   ['1.125rem', { lineHeight: '1.75rem' }],
                xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
                '2xl':['1.5rem',   { lineHeight: '2rem'    }],
                '3xl':['1.875rem', { lineHeight: '2.25rem' }],
                '4xl':['2.25rem',  { lineHeight: '2.5rem'  }],
                '5xl':['3rem',     { lineHeight: '1.15'    }],
            },
            borderRadius: {
                card: 'var(--radius-card)',
                sm:   'var(--radius-sm)',
                xl:   '0.75rem',
                lg:   '0.5rem',
            },
            boxShadow: {
                card:     'var(--shadow-card)',
                elevated: 'var(--shadow-elevated)',
                modal:    'var(--shadow-modal)',
            },
            transitionDuration: {
                fast: '150ms',
                base: '220ms',
                slow: '320ms',
            },
        },
    },
    plugins: [],
};
