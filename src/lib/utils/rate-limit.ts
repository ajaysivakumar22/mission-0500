import { NextResponse, type NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Production-grade rate limiter for API routes.
 * 
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * are set (recommended for production on Vercel). Falls back to in-memory
 * sliding window when those env vars are absent (dev/CI).
 */

// ─── Upstash Redis rate limiter (distributed, survives restarts) ────────────

const useUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | null = null;
const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(config: RateLimitConfig): Ratelimit {
    const key = `${config.maxRequests}:${config.windowSeconds}`;
    let limiter = upstashLimiters.get(key);
    if (!limiter) {
        if (!redis) {
            redis = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL!,
                token: process.env.UPSTASH_REDIS_REST_TOKEN!,
            });
        }
        limiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowSeconds} s`),
            prefix: 'ratelimit',
        });
        upstashLimiters.set(key, limiter);
    }
    return limiter;
}

// ─── In-memory fallback (dev/CI) ────────────────────────────────────────────

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

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
 * Uses Upstash Redis in production, in-memory fallback in dev/CI.
 */
export async function rateLimit(
    request: NextRequest,
    config: RateLimitConfig = DEFAULT_CONFIG
): Promise<NextResponse | null> {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';

    const identifier = `${ip}:${request.nextUrl.pathname}`;

    // ─── Upstash path (production) ──────────────────────────────────
    if (useUpstash) {
        const limiter = getUpstashLimiter(config);
        const { success, limit, remaining, reset } = await limiter.limit(identifier);

        if (!success) {
            const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Limit': String(limit),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
                    },
                }
            );
        }
        return null;
    }

    // ─── In-memory fallback (dev/CI) ────────────────────────────────
    cleanupStaleEntries();

    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(identifier, {
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
