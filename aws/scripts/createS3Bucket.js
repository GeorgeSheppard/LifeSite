import {
  S3Client,
  CreateBucketCommand,
  PutBucketCorsCommand,
  PutBucketVersioningCommand
} from "@aws-sdk/client-s3";
import * as DotEnv from "dotenv";
DotEnv.config({ path: "../.env.local" });

const isProduction = process.argv.includes("--prod");
export const s3Client = new S3Client({ region: process.env.ENV_AWS_S3_REGION });

async function createBucket() {
  try {
    const bucket = isProduction
      ? process.env.ENV_AWS_S3_BUCKET_NAME_PROD
      : process.env.ENV_AWS_S3_BUCKET_NAME;

    const data = await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucket,
      })
    );
    console.log(data);
    console.log("Successfully created a bucket called ", data.Location);

    if (isProduction) {
      const versioning = await s3Client.send(
        new PutBucketVersioningCommand({
          Bucket: bucket,
          VersioningConfiguration: {
            Status: "Enabled"
          }
        })
      )

      console.log(versioning);
      console.log("Successfully turned on versioning for bucket")
    }

    const corsData = await s3Client.send(
      new PutBucketCorsCommand({
        Bucket: bucket,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: ["*"],
              AllowedMethods: ["HEAD", "GET", "PUT", "POST", "DELETE"],
              AllowedOrigins: ["*"],
              ExposeHeaders: ["ETag"],
            },
          ],
        },
      })
    );

    console.log("Successfully added CORS configuration", corsData);
  } catch (err) {
    console.log("Error ", err);
  }
}

await createBucket();
