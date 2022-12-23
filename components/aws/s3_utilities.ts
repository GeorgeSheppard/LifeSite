import { GetObjectCommand } from "@aws-sdk/client-s3";
import { AwsS3Client } from "./s3_client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Key, S3SignedUrl } from "../../store/reducers/types";

export async function getS3SignedUrl(key: S3Key): Promise<S3SignedUrl> {
  return await getSignedUrl(
    AwsS3Client,
    new GetObjectCommand({
      Bucket: process.env.ENV_AWS_S3_BUCKET_NAME,
      Key: key,
    })
  );
}
