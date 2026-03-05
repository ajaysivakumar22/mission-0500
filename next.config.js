/** @type {import('next').NextConfig} */

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

module.exports = withPWA(nextConfig);
