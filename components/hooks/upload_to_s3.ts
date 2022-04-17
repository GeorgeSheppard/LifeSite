import { useCallback } from "react";
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from 'uuid';
import { AwsS3Client } from '../aws/s3_client';
import { S3Key } from "../../store/reducers/types";
import { useSession } from "next-auth/react";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";

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
  folder?: string;
  /**
   * Preprends a uuid to the filename, defaults to true
   */
  makeKeyUnique?: boolean;
}

/**
 * Place a file into the user's folder
 * If they are unauthenticated then the data gets dumped to a shared folder
 * 
 * @param folder?: string - S3 doesn't really have folders but helps to organise
 */
export default function useUploadToS3(props: IUseUploadToS3Props) {
  const session = useSession().data as CustomSession;

  const userFolder = session?.id ?? "shared";

  const uploadFile = useCallback(async (file: File) => {
    const onStartUpload = props.onStartUpload;
    const onUploadError = props.onUploadError;
    const onUploadFinished = props.onUploadFinished;

    if (!file) {
      onUploadError?.({ error: "No file attached to upload" })
      return;
    }

    onStartUpload?.();

    let fileKey = file.name;
    if (props.makeKeyUnique ?? true) {
      fileKey = uuidv4() + "_" + fileKey
    }

    let pathToFile = `${userFolder}/`;
    if (props.folder) {
      pathToFile += `${props.folder}/`;
    }
    pathToFile += fileKey;
    
    let upload;
    try {
      upload = await AwsS3Client.send(new PutObjectCommand({ Body: file, Bucket: process.env.ENV_AWS_S3_BUCKET_NAME, Key: pathToFile }))
    } catch (err) {
      onUploadError?.({ error: "unknown" })
    }

    if (upload?.$metadata.httpStatusCode === 200) {
      onUploadFinished?.({ key: pathToFile });
    } else {
      onUploadError?.({ error: "unknown" });
    }
  }, [props.onStartUpload, props.onUploadError, props.onUploadFinished, userFolder, props.folder, props.makeKeyUnique]);

  return { uploadFile }
}