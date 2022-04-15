import { S3Client, CreateBucketCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
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

    await s3Client.send(new PutBucketCorsCommand({
      Bucket: data.Bucket,
      CORSConfiguration: [
        {
            AllowedHeaders: [
                "*"
            ],
            AllowedMethods: [
                "HEAD",
                "GET",
                "PUT",
                "POST",
                "DELETE"
            ],
            AllowedOrigins: [
                "*"
            ],
            ExposeHeaders: [
                "ETag"
            ]
        }
    ]
    }))

    console.log("Successfully added CORS configuration")
  } catch (err) {
    console.log("Error ", err);
  }
}

await createBucket(params);
