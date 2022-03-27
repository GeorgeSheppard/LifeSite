import { useCallback } from "react";
import aws from 'aws-sdk';
import { IErrorUploadResponse, IValidUploadResponse } from '../../pages/api/filesUpload';

export interface IUseUploadToS3Props {
  onUploadFinished?: (response: IValidUploadResponse) => void;
  onUploadError?: (response: IErrorUploadResponse) => void;
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
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/awsS3Upload?file=${filename}`);
    const { url, fields } = (await res.json() as aws.S3.PresignedPost);
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const upload = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (upload.ok) {
      onUploadFinished?.({ writePath: upload.url });
    } else {
      onUploadError?.({ error: upload.statusText });
    }
  }, [props.onStartUpload, props.onUploadError, props.onUploadFinished]);

  return { uploadFile }
}