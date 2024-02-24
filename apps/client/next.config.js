module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@mad-land/ui", "@mad-land/lib", "@mad-land/contracts"],
};

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    // You can get this from the Organization settings page in Sentry
    org: "avalon-labs-dp",
    // You can get this from the Project settings page in Sentry
    project: "mad-land",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    disableLogger: true,
  }
);
