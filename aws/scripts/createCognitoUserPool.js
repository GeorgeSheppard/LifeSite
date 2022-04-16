import {
  CognitoIdentityProviderClient,
  CreateUserPoolCommand,
  CreateUserPoolClientCommand,
  CreateUserPoolDomainCommand,
  CreateIdentityProviderCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import * as DotEnv from "dotenv";
DotEnv.config({ path: "../.env.local" });

const isProduction = process.argv.includes("--prod");
const region = process.env.ENV_AWS_COGNITO_REGION;

const cognitoClient = new CognitoIdentityProviderClient({
  region,
});

async function createCognitoUserPool() {
  try {
    const poolName = isProduction
      ? process.env.ENV_AWS_COGNITO_USER_POOL_NAME_PROD
      : process.env.ENV_AWS_COGNITO_USER_POOL_NAME;

    const data = await cognitoClient.send(
      new CreateUserPoolCommand({
        PoolName: poolName,
        AutoVerifiedAttributes: ["email"],
        UsernameAttributes: ["email"],
        Policies: {
          PasswordPolicy: {
            RequireUppercase: false,
            RequireLowercase: false,
            RequireNumbers: false,
            RequireSymbols: false,
            MinimumLength: 10,
          },
        },
      })
    );
    console.log("Successfully created a cognito user pool: ", data);

    const provider = await cognitoClient.send(
      new CreateIdentityProviderCommand({
        UserPoolId: data.UserPool.Id,
        ProviderName: "Google",
        ProviderType: "Google",
        ProviderDetails: {
          client_id: process.env.ENV_GOOGLE_ID,
          client_secret: process.env.ENV_GOOGLE_SECRET,
          authorize_scopes: "profile email openid",
        },
      })
    );
    console.log(provider);
    console.log("Successfully added provider ", provider);

    const clientName = isProduction
      ? process.env.ENV_AWS_COGNITO_USER_POOL_CLIENT_NAME_PROD
      : process.env.ENV_AWS_COGNITO_USER_POOL_CLIENT_NAME;

    const baseUrl = isProduction
      ? process.env.ENV_LOGIN_LOGOUT_REDIRECT_URL_PROD
      : process.env.ENV_LOGIN_LOGOUT_REDIRECT_URL;

    const client = await cognitoClient.send(
      new CreateUserPoolClientCommand({
        UserPoolId: data.UserPool.Id,
        ClientName: clientName,
        GenerateSecret: true,
        SupportedIdentityProviders: ["COGNITO", "Google"],
        CallbackURLs: [`${baseUrl}/api/auth/callback/cognito`],
        LogoutURLs: [baseUrl],
        AllowedOAuthFlows: ["code"],
        AllowedOAuthScopes: ["email", "openid", "profile"],
      })
    );

    console.log("Successfully added client ", client);

    const domainName = isProduction
      ? process.env.ENV_AWS_COGNITO_USER_POOL_DOMAIN_NAME_PROD
      : process.env.ENV_AWS_COGNITO_USER_POOL_DOMAIN_NAME

    const domain = await cognitoClient.send(
      new CreateUserPoolDomainCommand({
        Domain: domainName,
        UserPoolId: data.UserPool.Id,
      })
    );

    console.log("Successfully added domain ", domain);

    console.log("----------------------");
    console.log("Client id: ", client.UserPoolClient.ClientId);
    console.log("Client secret: ", client.UserPoolClient.ClientSecret);
    console.log(
      "Issuer: ",
      `https://cognito-idp.${region}.amazonaws.com/${data.UserPool.Id}`
    );
    console.log(
      "Domain URL: ",
      `https://${poolName}domain.auth.${region}.amazoncognito.com`
    );
    console.log("Remember to update these in the .env.local");
    console.log(
      "Remember to make sure the direct uris in google developer console match up with the domain"
    );
  } catch (err) {
    console.log("Error ", err);
  }
}

await createCognitoUserPool();
