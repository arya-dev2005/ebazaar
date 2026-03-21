import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LIMIT = 100; // requests per window
const WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Database-backed rate limiter for serverless environments
 * Uses Prisma to track requests in the database
 * Returns true if request is allowed, false if rate limit exceeded
 */
async function rateLimit(key: string): Promise<boolean> {
    const now = Date.now();
    const windowStart = new Date(now - WINDOW_MS);

    try {
        // Clean up old rate limit records (older than 5 minutes)
        await prisma.rateLimit.deleteMany({
            where: {
                createdAt: { lt: new Date(now - 5 * 60 * 1000) },
            },
        });

        // Count requests in current window
        const count = await prisma.rateLimit.count({
            where: {
                key,
                createdAt: { gte: windowStart },
            },
        });

        if (count >= LIMIT) {
            return false;
        }

        // Record this request
        await prisma.rateLimit.create({
            data: { key },
        });

        return true;
    } catch {
        // If rate limiting fails (e.g., DB unavailable), allow the request
        // This prevents blocking all requests if rate limiting has issues
        return true;
    }
}

/**
 * Get client IP address from request
 */
function getClientIP(req: Request): string {
    // Try to get IP from various headers (for deployment behind proxies)
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    const realIP = req.headers.get("x-real-ip");
    if (realIP) {
        return realIP;
    }

    // Fallback - use a default for development
    return "127.0.0.1";
}

export const runtime = "nodejs";

export default auth(async (req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // Apply rate limiting for API routes
    if (pathname.startsWith("/api")) {
        const clientIP = getClientIP(req);

        if (!(await rateLimit(clientIP))) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }
    }

    // Admin routes require ADMIN role
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
        if ((req.auth?.user as any)?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Protected routes require authentication
    const protectedRoutes = ["/cart", "/checkout", "/orders"];
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!isLoggedIn) {
            const signInUrl = new URL("/sign-in", req.url);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
