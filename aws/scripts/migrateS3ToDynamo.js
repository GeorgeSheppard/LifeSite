import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import george from "../profiles/george.json" assert { type: "json" };
import rose from "../profiles/rose.json" assert { type: "json" };
import * as DotEnv from "dotenv";
DotEnv.config({ path: "../.env.local" });

const isProduction = process.argv.includes("--prod");

const roseId = process.env.ROSE_ID;
const georgeId = process.env.GEORGE_ID;

const region = process.env.ENV_AWS_DYNAMO_REGION;
const accessKeyId = process.env.ENV_AWS_DYNAMO_ACCESS_KEY;
const secretAccessKey = process.env.ENV_AWS_DYNAMO_SECRET_ACCESS_KEY;
const TableName = isProduction
  ? process.env.ENV_AWS_DYNAMO_NAME_PROD
  : process.env.ENV_AWS_DYNAMO_NAME;
console.log("Env", region, accessKeyId, secretAccessKey, TableName);

const AwsDynamoClient = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const AwsDynamoDocClient = DynamoDBDocument.from(AwsDynamoClient);

const putProfileToDynamo = async (profile, userId) => {
  for (const [id, item] of Object.entries(profile.food.recipes)) {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Uploading: ", item.name);
    await AwsDynamoDocClient.put({
      TableName,
      Item: {
        ...item,
        UserId: userId,
        Item: `R-${id}`,
      },
    });
  }
};

await putProfileToDynamo(george, georgeId);
await putProfileToDynamo(rose, roseId);
