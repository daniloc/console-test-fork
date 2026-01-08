import * as Sentry from '@sentry/sveltekit';
import posthog from 'posthog-js';
import { isCloud, isProd } from '$lib/system';
import { AppwriteException } from '@appwrite.io/console';
import type { HandleClientError } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

Sentry.init({
    enabled: isCloud && isProd,
    dsn: 'https://c7ce178bdedd486480317b72f282fd39@o1063647.ingest.us.sentry.io/4504158071422976',
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0
});

// Initialize PostHog when the app starts in the browser
export async function init() {
    if (env.PUBLIC_POSTHOG_KEY) {
        posthog.init(env.PUBLIC_POSTHOG_KEY, {
            api_host: env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
            ui_host: 'https://us.posthog.com',
            defaults: '2025-11-30',
            capture_exceptions: true
        });
    }
}

export const handleError: HandleClientError = ({ error, message, status }) => {
    console.error(error);

    // Capture error with PostHog
    if (env.PUBLIC_POSTHOG_KEY) {
        posthog.captureException(error);
    }

    let type;
    if (error instanceof AppwriteException) {
        status = error.code === 0 ? undefined : error.code;
        message = error.message;
        type = error.type;
    }

    return {
        message,
        status,
        type
    };
};
