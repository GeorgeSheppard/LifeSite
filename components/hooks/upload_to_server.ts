import { ChangeEvent, ChangeEventHandler } from "react";
import { useState, useCallback } from "react";

export interface IUploadProps {
  onSaveToClient?: (file: File) => void;
  onUploadError?: (error: string) => void;
  onUploadFinished?: (response: any) => void;
}

const getTargetFile = (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target.files?.[0]) {
    return event.target.files[0];
  }
};

export default function useUpload(props: IUploadProps) {
  const { onSaveToClient, onUploadFinished, onUploadError } = props;

  const [file, setFile] = useState<File | undefined>(undefined);

  const uploadToClient = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const targetFile = getTargetFile(event);
      if (targetFile) {
        setFile(targetFile);
        onSaveToClient?.(targetFile);
        return targetFile;
      }
    },
    [setFile, onSaveToClient]
  );

  const sendFile = useCallback(
    async (file: File) => {
      const body = new FormData();
      body.append("files", file);

      const response = await fetch("/api/filesUpload", {
        method: "POST",
        body,
      });

      if (response.ok) {
        setFile(undefined);
        onUploadFinished?.(response);
      } else {
        onUploadError?.(response.statusText);
      }
    },
    [onUploadFinished, onUploadError]
  );

  const uploadToServer = useCallback(
    async (fileToUpload?: File) => {
      fileToUpload = fileToUpload ?? file;
      if (fileToUpload) {
        sendFile(fileToUpload);
      }
    },
    [file, sendFile]
  );

  const fullUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const fileToUpload = uploadToClient(event);
      await uploadToServer(fileToUpload);
    },
    [uploadToClient, uploadToServer]
  );

  return { uploadToClient, uploadToServer, fullUpload };
}
