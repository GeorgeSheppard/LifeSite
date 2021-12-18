import { ChangeEvent, ChangeEventHandler } from "react";
import { useState, useCallback } from "react";

export interface IUploadProps {
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export default function useUpload(props: IUploadProps) {
  const { onLoad, onError } = props;

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadToClient = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.[0]) {
        setFile(event.target.files[0]);
      }
    },
    [setFile]
  );

  const uploadToServer = useCallback(async () => {
    if (file) {
      setUploading(true);
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/file", {
        method: "POST",
        body,
      });

      if (response.ok) {
        onLoad?.();
        setUploading(false);
      } else {
        onError?.(response.statusText);
      }
    }
  }, [file, onLoad, onError]);

  const fullUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      uploadToClient(event);
      await uploadToServer();
    },
    [uploadToClient, uploadToServer]
  );

  return { uploadToClient, uploadToServer, fullUpload, uploading };
}
