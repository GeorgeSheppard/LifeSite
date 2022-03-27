import aws from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    signatureVersion: 'v4',
  });
  
  const s3 = new aws.S3();
  const post = await s3.createPresignedPost({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Fields: {
      key: req.query.file,
    },
    Expires: 60, // seconds
    Conditions: [
    ],
  });

  res.status(200).json(post);
}