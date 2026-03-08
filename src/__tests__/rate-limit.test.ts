/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

// Mock NextRequest for testing (node environment required for Request global)
function createMockRequest(path: string, ip: string = '127.0.0.1'): NextRequest {
    const url = `http://localhost:3000${path}`;
    const request = new NextRequest(url, {
        headers: {
            'x-forwarded-for': ip,
        },
    });
    return request;
}

// Dynamic import to reset module state between tests
let rateLimit: typeof import('@/lib/utils/rate-limit').rateLimit;

beforeEach(async () => {
    // Re-import to get fresh rate limit map
    jest.resetModules();
    const mod = await import('@/lib/utils/rate-limit');
    rateLimit = mod.rateLimit;
});

describe('rateLimit', () => {
    it('allows requests under the limit', async () => {
        const request = createMockRequest('/api/profile', '10.0.0.1');
        const result = await rateLimit(request, { maxRequests: 5, windowSeconds: 60 });
        expect(result).toBeNull();
    });

    it('blocks requests over the limit', async () => {
        const config = { maxRequests: 3, windowSeconds: 60 };

        for (let i = 0; i < 3; i++) {
            const req = createMockRequest('/api/profile', '10.0.0.2');
            expect(await rateLimit(req, config)).toBeNull();
        }

        // 4th request should be blocked
        const blocked = createMockRequest('/api/profile', '10.0.0.2');
        const result = await rateLimit(blocked, config);
        expect(result).not.toBeNull();
        expect(result!.status).toBe(429);
    });

    it('tracks different IPs independently', async () => {
        const config = { maxRequests: 1, windowSeconds: 60 };

        const req1 = createMockRequest('/api/test', '10.0.0.3');
        expect(await rateLimit(req1, config)).toBeNull();

        // Different IP should still be allowed
        const req2 = createMockRequest('/api/test', '10.0.0.4');
        expect(await rateLimit(req2, config)).toBeNull();

        // First IP should now be blocked
        const req3 = createMockRequest('/api/test', '10.0.0.3');
        expect(await rateLimit(req3, config)).not.toBeNull();
    });

    it('includes rate limit headers in 429 response', async () => {
        const config = { maxRequests: 1, windowSeconds: 60 };

        const req1 = createMockRequest('/api/test', '10.0.0.5');
        await rateLimit(req1, config);

        const req2 = createMockRequest('/api/test', '10.0.0.5');
        const result = await rateLimit(req2, config);

        expect(result).not.toBeNull();
        expect(result!.headers.get('Retry-After')).toBeTruthy();
        expect(result!.headers.get('X-RateLimit-Limit')).toBe('1');
        expect(result!.headers.get('X-RateLimit-Remaining')).toBe('0');

        const body = await result!.json();
        expect(body.error).toContain('Too many requests');
    });
});
