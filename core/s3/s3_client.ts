import { S3Client } from "@aws-sdk/client-s3"

console.log(
  "s3 client",
  process.env.ENV_AWS_S3_REGION,
  process.env.ENV_AWS_S3_ACCESS_KEY,
  process.env.ENV_AWS_S3_SECRET_ACCESS_KEY,
  typeof window === 'undefined'
);
export const AwsS3Client = new S3Client({
  region: process.env.ENV_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.ENV_AWS_S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.ENV_AWS_S3_SECRET_ACCESS_KEY ?? "",
  },
  logger: console,
  maxAttempts: 1,
});
console.log('after s3 client')