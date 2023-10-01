import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { S3Key } from "../../types/general";
import { useAppSession } from "../../hooks/use_app_session";
import { trpc } from "../../../client";

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
  const { id, loading } = useAppSession();
  const putToS3 = trpc.s3.put.useMutation()

  const uploadFile = useCallback(
    async (file: File) => {
      const onStartUpload = props.onStartUpload;
      const onUploadError = props.onUploadError;
      const onUploadFinished = props.onUploadFinished;

      if (loading) {
        onUploadError?.({ error: "User is loading" });
        return;
      }

      if (!file) {
        onUploadError?.({ error: "No file attached to upload" });
        return;
      }

      onStartUpload?.();

      let fileKey = file.name;
      if (props.makeKeyUnique ?? true) {
        fileKey = uuidv4() + "_" + fileKey;
      }

      // TODO: Fix the upload
      // // If there is no user logged in place in the shared folder
      // let pathToFile = `${id ?? shared}/`;
      // if (props.folder) {
      //   pathToFile += `${props.folder}/`;
      // }
      // pathToFile += fileKey;

      // let upload;
      // try {
      //   // TODO: Fix this over TRPC
      //   const fileString = await file.text()
      //   upload = await putToS3.mutateAsync({ key: pathToFile, file: fileString });
      // } catch (err) {
      //   onUploadError?.({ error: "unknown" });
      // }

      // // TODO: Fix this too
      // // if (upload?.$metadata.httpStatusCode === 200) {
      // //   onUploadFinished?.({ key: pathToFile });
      // // } else {
      // //   onUploadError?.({ error: "unknown" });
      // // }
    },
    [
      props.onStartUpload,
      props.onUploadError,
      props.onUploadFinished,
      // props.folder,
      props.makeKeyUnique,
      // putToS3,
      loading,
      // id
    ]
  );

  return { uploadFile, loading };
}
