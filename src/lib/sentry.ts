import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: process.env.NODE_ENV === "production",

    // Performance monitoring
    tracesSampleRate: 1.0,

    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Filter events
    beforeSend(event) {
        // Filter out certain errors in development
        if (process.env.NODE_ENV === "development") {
            return null;
        }
        return event;
    },
});

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
