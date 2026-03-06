/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs');

const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

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
