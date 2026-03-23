// Sentry initialization - only available if @sentry/nextjs is installed
// This is optional and used for production error tracking

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sentry: any = null;

function getSentry() {
    if (!_sentry) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            _sentry = require("@sentry/nextjs");
        } catch {
            // Sentry not installed - return null
            return null;
        }
    }
    return _sentry;
}

export function captureException(error: unknown) {
    const sentry = getSentry();
    if (sentry) {
        sentry.captureException(error);
    } else {
        console.error("Sentry not configured:", error);
    }
}

export function captureMessage(message: string) {
    const sentry = getSentry();
    if (sentry) {
        sentry.captureMessage(message);
    } else {
        console.log("Sentry not configured:", message);
    }
}

// Initialize Sentry if available
try {
    const sentry = getSentry();
    if (sentry) {
        sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            enabled: process.env.NODE_ENV === "production",
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            beforeSend(event: any) {
                if (process.env.NODE_ENV === "development") {
                    return null;
                }
                return event;
            },
        });
    }
} catch {
    // Sentry initialization failed - continue without it
}
