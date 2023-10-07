import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { AwsS3Client } from "./s3_client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Key, S3SignedUrl } from "../types/general";

export async function getS3SignedUrl(key: S3Key): Promise<S3SignedUrl> {
  return await getSignedUrl(
    AwsS3Client,
    new GetObjectCommand({
      Bucket: process.env.ENV_AWS_S3_BUCKET_NAME,
      Key: key,
    })
  );
}

export async function PutToS3(
  key: S3Key,
  file: File
): Promise<PutObjectCommandOutput> {
  return await AwsS3Client.send(
    new PutObjectCommand({
      Body: file,
      Bucket: process.env.ENV_AWS_S3_BUCKET_NAME,
      Key: key,
    })
  );
}

// export async function getPresignedPostUrl(key: S3Key) {
//   return createPresignedPost(AwsS3Client, {
//     Bucket: process.env.ENV_AWS_S3_BUCKET_NAME!,
//     Key: key,
//   });
// }

export async function getS3SignedPostUrl(key: S3Key): Promise<S3SignedUrl> {
  return await getSignedUrl(
    AwsS3Client,
    new PutObjectCommand({
      Bucket: process.env.ENV_AWS_S3_BUCKET_NAME,
      Key: key
    })
  )
}

export async function DeleteFromS3(
  key: S3Key
): Promise<DeleteObjectCommandOutput> {
  return await AwsS3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.ENV_AWS_S3_BUCKET_NAME,
      Key: key,
    })
  );
}
