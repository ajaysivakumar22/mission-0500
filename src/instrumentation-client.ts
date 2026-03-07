import * as Sentry from '@sentry/nextjs';

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    enabled: process.env.NODE_ENV === 'production',
    tracesSampleRate: 0.2,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    ignoreErrors: [
        'ResizeObserver loop',
        'Non-Error promise rejection',
        'AbortError',
        'Network request failed',
    ],
});
