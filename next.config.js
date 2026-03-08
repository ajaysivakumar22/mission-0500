/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs');

const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

// Content Security Policy headers for XSS and injection prevention
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://*.supabase.co';
const supabaseDomain = supabaseUrl.replace(/^https?:\/\//, '');

const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `connect-src 'self' https://${supabaseDomain} wss://${supabaseDomain} https://*.ingest.sentry.io`,
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
].join('; ');

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'Content-Security-Policy', value: cspHeader },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ];
    },
};

const sentryConfig = {
    // Suppress source map upload warnings in dev/CI without SENTRY_AUTH_TOKEN
    silent: !process.env.SENTRY_AUTH_TOKEN,
    // Upload source maps for better error traces in production
    widenClientFileUpload: true,
    // Hide source maps from client bundles
    hideSourceMaps: true,
};

module.exports = withSentryConfig(withPWA(nextConfig), sentryConfig);
