import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import * as DotEnv from "dotenv";
DotEnv.config({ path: "../.env.local" });

const isProduction = process.argv.includes("--prod");

const dynamoRegion = process.env.ENV_AWS_DYNAMO_REGION;
const name = isProduction
  ? process.env.ENV_AWS_DYNAMO_NAME_PROD
  : process.env.ENV_AWS_DYNAMO_NAME;
if (!dynamoRegion || !name) {
  throw new Error("Parameters missing");
}

const dynamodbClient = new DynamoDBClient({
  region: dynamoRegion,
});

const schema = {
  AttributeDefinitions: [
    {
      AttributeName: "UserId",
      AttributeType: "S",
    },
    {
      AttributeName: "Item",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "UserId",
      KeyType: "HASH", // Partition key
    },
    {
      AttributeName: "Item",
      KeyType: "RANGE", // Sort key
    },
  ],
  TableName: name,
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  StreamSpecification: {
    StreamEnabled: false,
  },
};

async function createTable() {
  try {
    const data = await dynamodbClient.send(new CreateTableCommand(schema));
    console.log("Table Created", data);
    return data;
  } catch (err) {
    console.log("Error creating table", err);
  }
}

await createTable();
