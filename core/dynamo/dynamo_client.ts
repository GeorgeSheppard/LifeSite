import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export const AwsDynamoClient = new DynamoDBClient({
  region: process.env.ENV_AWS_DYNAMO_REGION,
  credentials: {
    accessKeyId: process.env.ENV_AWS_DYNAMO_ACCESS_KEY ?? "",
    secretAccessKey: process.env.ENV_AWS_DYNAMO_SECRET_ACCESS_KEY ?? "",
  },
});

export const AwsDynamoDocClient = DynamoDBDocument.from(AwsDynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true
  }
});