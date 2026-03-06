import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

    // Only enable in production
    enabled: process.env.NODE_ENV === 'production',

    // Performance monitoring — sample 20% of transactions
    tracesSampleRate: 0.2,

    // Set environment
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,

    // Filter out noisy errors
    ignoreErrors: [
        'ResizeObserver loop',
        'Non-Error promise rejection',
        'AbortError',
        'Network request failed',
    ],
});
