import { S3Client } from "@aws-sdk/client-s3"
import { getS3SignedUrl } from "./s3_utilities";

export const AwsS3Client = new S3Client({
  region: process.env.ENV_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.ENV_AWS_S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.ENV_AWS_S3_SECRET_ACCESS_KEY ?? "",
  },
  logger: console,
  maxAttempts: 1,
});

getS3SignedUrl("test.json").then(() => console.log('S3 test query'))