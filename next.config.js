const path = require("path");
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
module.exports = (phase) => {
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
  };

  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    envVariables.ENV_LOGIN_LOGOUT_REDIRECT_URL =
      process.env.VERCEL_URL;
    envVariables.ENV_AWS_S3_BUCKET_NAME =
      process.env.ENV_AWS_S3_BUCKET_NAME_PROD;
    envVariables.ENV_AWS_COGNITO_CLIENT_ID =
      process.env.ENV_AWS_COGNITO_CLIENT_ID_PROD;
    envVariables.ENV_AWS_COGNITO_CLIENT_SECRET =
      process.env.ENV_AWS_COGNITO_CLIENT_SECRET_PROD;
    envVariables.ENV_COGNITO_CLIENT_ISSUER =
      process.env.ENV_AWS_COGNITO_CLIENT_ISSUER_PROD;
    envVariables.ENV_COGNITO_DOMAIN_URL =
      process.env.ENV_AWS_COGNITO_DOMAIN_URL_PROD;
  }

  return {
    reactStrictMode: true,
    sassOptions: {
      includePaths: [path.join(__dirname, "styles")],
    },
    env: envVariables,
  };
};
