import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Sentry plugin configuration - only enable if Sentry is configured
let exportedConfig = nextConfig;

if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const withSentryConfig = require("@sentry/nextjs").withSentryConfig;

  const sentryWebpackPluginOptions = {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  };

  exportedConfig = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
}

export default exportedConfig;
