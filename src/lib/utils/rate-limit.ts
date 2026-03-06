import { NextResponse, type NextRequest } from 'next/server';

/**
 * Simple in-memory rate limiter for API routes.
 * Tracks requests per IP using a sliding window.
 * 
 * Note: In-memory — resets on deploy/restart. For distributed
 * rate limiting at scale, use Upstash Redis or Vercel KV.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}

export interface RateLimitConfig {
    /** Max requests allowed in the window */
    maxRequests: number;
    /** Window duration in seconds */
    windowSeconds: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 60,
    windowSeconds: 60,
};

/**
 * Check if a request should be rate limited.
 * Returns null if allowed, or a NextResponse with 429 if blocked.
 */
export function rateLimit(
    request: NextRequest,
    config: RateLimitConfig = DEFAULT_CONFIG
): NextResponse | null {
    cleanupStaleEntries();

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';

    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();

    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
        // New window
        rateLimitMap.set(key, {
            count: 1,
            resetAt: now + config.windowSeconds * 1000,
        });
        return null;
    }

    entry.count++;

    if (entry.count > config.maxRequests) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
                status: 429,
                headers: {
                    'Retry-After': String(retryAfter),
                    'X-RateLimit-Limit': String(config.maxRequests),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
                },
            }
        );
    }

    return null;
}
