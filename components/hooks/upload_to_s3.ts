import { useCallback } from "react";
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from 'uuid';
import { AwsS3Client } from '../aws/s3_client';
import { S3Key } from "../../store/reducers/types";

export interface IS3ValidUploadResponse {
  key: S3Key;
}

export interface IS3ErrorUploadResponse {
  error: string;
}

export interface IUseUploadToS3Props {
  onUploadFinished?: (response: IS3ValidUploadResponse) => void;
  onUploadError?: (response: IS3ErrorUploadResponse) => void;
  onStartUpload?: () => void;
}

export default function useUploadToS3(props: IUseUploadToS3Props) {
  const uploadFile = useCallback(async (file: File) => {
    const onStartUpload = props.onStartUpload;
    const onUploadError = props.onUploadError;
    const onUploadFinished = props.onUploadFinished;

    if (!file) {
      onUploadError?.({ error: "No file attached to upload" })
      return;
    }

    onStartUpload?.();

    const fileKey = uuidv4() + "_" + file.name;

    const upload = await AwsS3Client.send(new PutObjectCommand({ Body: file, Bucket: process.env.AWS_S3_BUCKET_NAME, Key: fileKey }))
    if (upload.$metadata.httpStatusCode === 200) {
      onUploadFinished?.({ key: fileKey });
    } else {
      onUploadError?.({ error: "unknown" });
    }
  }, [props.onStartUpload, props.onUploadError, props.onUploadFinished]);

  return { uploadFile }
}