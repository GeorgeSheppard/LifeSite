import { CreateBucketCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import * as DotEnv from "dotenv";
DotEnv.config({ path: "../.env.local"});

export const s3Client = new S3Client({ region: process.env.AWS_REGION });

const params = {
  Bucket: "mylifebucket",
};

async function createBucket(params) {
  try {
    const data = await s3Client.send(new CreateBucketCommand(params));
    console.log(data);
    console.log("Successfully created a bucket called ", data.Location);
  } catch (err) {
    console.log("Error ", err);
  }
}

await createBucket(params);
