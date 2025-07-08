// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

const path = require("path");
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
module.exports = (phase) => {
    if (Object.keys(process.env).length === 0) {
      console.error("No environment variables");
    }

    const envVariables = {
      ENV_LOGIN_LOGOUT_REDIRECT_URL: process.env.ENV_LOGIN_LOGOUT_REDIRECT_URL,
      ENV_AWS_S3_REGION: process.env.ENV_AWS_S3_REGION,
      ENV_AWS_S3_BUCKET_NAME: process.env.ENV_AWS_S3_BUCKET_NAME,
      ENV_AWS_S3_ACCESS_KEY: process.env.ENV_AWS_S3_ACCESS_KEY,
      ENV_AWS_S3_SECRET_ACCESS_KEY: process.env.ENV_AWS_S3_SECRET_ACCESS_KEY,
      NEXTAUTH_URL: process.env.ENV_LOGIN_LOGOUT_REDIRECT_URL,
      ENV_AWS_COGNITO_CLIENT_ID: process.env.ENV_AWS_COGNITO_CLIENT_ID,
      ENV_AWS_COGNITO_CLIENT_SECRET: process.env.ENV_AWS_COGNITO_CLIENT_SECRET,
      ENV_AWS_COGNITO_DOMAIN_URL: process.env.ENV_AWS_COGNITO_DOMAIN_URL,
      ENV_AWS_COGNITO_CLIENT_ISSUER: process.env.ENV_AWS_COGNITO_CLIENT_ISSUER,
      ENV_AWS_DYNAMO_REGION: process.env.ENV_AWS_DYNAMO_REGION,
      ENV_AWS_DYNAMO_NAME: process.env.ENV_AWS_DYNAMO_NAME,
      ENV_AWS_DYNAMO_ACCESS_KEY: process.env.ENV_AWS_DYNAMO_ACCESS_KEY,
      ENV_AWS_DYNAMO_SECRET_ACCESS_KEY:
        process.env.ENV_AWS_DYNAMO_SECRET_ACCESS_KEY,
      ENV_OPENAI_SECRET_ACCESS_KEY: process.env.ENV_OPENAI_SECRET,
      ENV_DOMAIN: "localhost:3000",
    };

    if (phase !== PHASE_DEVELOPMENT_SERVER) {
      envVariables.ENV_LOGIN_LOGOUT_REDIRECT_URL =
        process.env.ENV_LOGIN_LOGOUT_REDIRECT_URL_PROD;
      envVariables.ENV_AWS_S3_BUCKET_NAME =
        process.env.ENV_AWS_S3_BUCKET_NAME_PROD;
      envVariables.ENV_AWS_COGNITO_CLIENT_ID =
        process.env.ENV_AWS_COGNITO_CLIENT_ID_PROD;
      envVariables.ENV_AWS_COGNITO_CLIENT_SECRET =
        process.env.ENV_AWS_COGNITO_CLIENT_SECRET_PROD;
      envVariables.ENV_AWS_COGNITO_CLIENT_ISSUER =
        process.env.ENV_AWS_COGNITO_CLIENT_ISSUER_PROD;
      envVariables.ENV_AWS_COGNITO_DOMAIN_URL =
        process.env.ENV_AWS_COGNITO_DOMAIN_URL_PROD;
      envVariables.ENV_AWS_DYNAMO_NAME = process.env.ENV_AWS_DYNAMO_NAME_PROD;
      envVariables.ENV_DOMAIN = process.env.ENV_DOMAIN;
    }

    return {
      reactStrictMode: true,
      env: envVariables,
      async rewrites() {
        return {
          beforeFiles: [
          
            {
              source: '/',
              destination: '/food'
            }
          ]
        }
      },
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: `${envVariables.ENV_AWS_S3_BUCKET_NAME}.s3.${envVariables.ENV_AWS_S3_REGION}.amazonaws.com`,
          },
        ],
      },
    };
  }


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "george-sheppard-0d",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
