import {
  CognitoIdentityProviderClient,
  CreateUserPoolCommand,
  CreateUserPoolClientCommand,
  CreateUserPoolDomainCommand
} from "@aws-sdk/client-cognito-identity-provider";
import * as DotEnv from "dotenv";
DotEnv.config({ path: "../.env.local" });

const region = "us-east-1"

const cognitoClient = new CognitoIdentityProviderClient({
  region: region,
});


async function createCognitoUserPool() {
  try {
    const data = await cognitoClient.send(new CreateUserPoolCommand({
      PoolName: "mylifeuserpool",
    }));
    console.log("Successfully created a cognito user pool: ", data);

    // const provider = await cognitoClient.send(
    //   new CreateIdentityProviderCommand({
    //     UserPoolId: data.UserPool.Id,
    //     ProviderName: "Google",
    //     ProviderType: "Google",
    //     ProviderDetails: {
    //       client_id: process.env.GOOGLE_ID,
    //       client_secret: process.env.GOOGLE_SECRET,
    //       authorize_scopes: "profile email openid",
    //     },
    //   })
    // );
    // console.log(provider);
    // console.log("Successfully added provider ", provider);

    const client = await cognitoClient.send(
      new CreateUserPoolClientCommand({
        UserPoolId: data.UserPool.Id,
        ClientName: "mylife",
        GenerateSecret: true,
        SupportedIdentityProviders: ["COGNITO"],
        CallbackURLs: ["http://localhost:3000/api/auth/callback/cognito"],
        AllowedOAuthFlows: ["code"],
        AllowedOAuthScopes: ["email", "openid", "profile"]
      })
    );

    console.log("Successfully added client ", client);

    const domain = await cognitoClient.send(
      new CreateUserPoolDomainCommand({
        Domain: "mylifecustomdomain",
        UserPoolId: data.UserPool.Id
      })
    )

    console.log("Successfully added domain ", domain);

    console.log("----------------------")
    console.log("Client id: ", client.UserPoolClient.ClientId);
    console.log("Client secret: ", client.UserPoolClient.ClientSecret)
    console.log("Issuer: ", `https://cognito-idp.${region}.amazonaws.com/${data.UserPool.Id}`)
    console.log("Remember to update these in the .env.local")
  } catch (err) {
    console.log("Error ", err);
  }
}

await createCognitoUserPool();
