import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { getFromDynamo } from "./dynamo_utilities";

console.log(
  "dynamo client",
  process.env.ENV_AWS_DYNAMO_REGION,
  process.env.ENV_AWS_DYNAMO_ACCESS_KEY,
  process.env.ENV_AWS_DYNAMO_SECRET_ACCESS_KEY,
  typeof window === 'undefined'
);
export const AwsDynamoClient = new DynamoDBClient({
  region: process.env.ENV_AWS_DYNAMO_REGION,
  credentials: {
    accessKeyId: process.env.ENV_AWS_DYNAMO_ACCESS_KEY ?? "",
    secretAccessKey: process.env.ENV_AWS_DYNAMO_SECRET_ACCESS_KEY ?? "",
  },
  logger: console,
  maxAttempts: 1,
});

export const AwsDynamoDocClient = DynamoDBDocument.from(AwsDynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

getFromDynamo({ type: "Test" }, "Test").then(() => console.log('Dynamo test query'))
console.log('after dynamo client')
