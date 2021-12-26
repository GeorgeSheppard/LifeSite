import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  IErrorUploadResponse,
  IUploadResponse,
  IValidUploadResponse,
} from "../../pages/api/filesUpload";

export interface IUploadProps {
  onStartUpload?: (file: File | string) => void;
  onUploadError?: (response: IErrorUploadResponse) => void;
  onUploadFinished?: (response: IValidUploadResponse) => void;
  folder: string;
}

export interface IFileUploadProps {
  file: File;
  /**
   * Inside the user folder, what folder name to save it under
   */
  folder: string;
  /**
   * Filename to store inside the folder
   */
  newFilename: string;
}

export interface ICustomForm extends FormData, IFileUploadProps {}

export default function useUpload(props: IUploadProps) {
  const { onStartUpload, onUploadFinished, onUploadError } = props;

  const createFileData = useCallback(
    (file: File | string) => {
      let name = "";
      if (file instanceof File) {
        name = file.name;
      }

      return {
        file: file,
        folder: props.folder,
        newFilename: uuidv4() + "_" + name,
      };
    },
    [props.folder]
  );

  const uploadFile = useCallback(
    async (targetFile: File | string, newFilename?: string) => {
      if (targetFile) {
        onStartUpload?.(targetFile);
        const fileData = createFileData(targetFile);

        const body = new FormData();
        body.set("folder", fileData.folder);
        body.set("file", fileData.file);
        body.set("newFilename", newFilename ?? fileData.newFilename);

        const response = await fetch("/api/filesUpload", {
          method: "POST",
          body: body as ICustomForm,
        });

        const json: IUploadResponse = await response.json();
        if (response.ok) {
          onUploadFinished?.(json as IValidUploadResponse);
        } else {
          onUploadError?.(json as IErrorUploadResponse);
        }
      }
    },
    [createFileData, onStartUpload, onUploadFinished, onUploadError]
  );

  return { uploadFile };
}
