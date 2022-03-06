import { useCallback, ChangeEvent, useMemo, ReactElement } from "react";
import useUpload from "../hooks/upload_to_server";
import {
  IErrorUploadResponse,
  IValidUploadResponse,
} from "../../pages/api/filesUpload";

export interface IClickToUploadProps {
  onUploadFinished?: (response: IValidUploadResponse) => void;
  onUploadError?: (response: IErrorUploadResponse) => void;
  onStartUpload?: () => void;
  /**
   * The folder the images should be stored in
   * e.g. images, models
   */
  folder: string;
  /**
   * Array of file formats the upload dialog should allow
   * e.g. ["png", "jpg", "stl"]
   */
  fileFormatsAccepted: string[];
  children: ReactElement | ReactElement[];
}

/**
 * Component for accessing the file system and uploading whatever the user selects
 * Whatever is passed in as children will be turned into a clickable element that
 * when clicked opens the file system and allows the user to select specific file formats
 * to upload.
 */
export const ClickToUpload = (props: IClickToUploadProps) => {
  const { uploadFile } = useUpload({
    onUploadFinished: props.onUploadFinished,
    onUploadError: props.onUploadError,
    onStartUpload: props.onStartUpload,
    folder: props.folder,
  });

  const getAndUploadFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const fileFormats = useMemo(() => {
    return props.fileFormatsAccepted.map((format) => "." + format).join(",");
  }, [props.fileFormatsAccepted]);

  return (
    <>
      <input
        type="file"
        id="upload-input"
        style={{ display: "none" }}
        multiple={false}
        onChange={getAndUploadFile}
        accept={fileFormats}
      />
      <label htmlFor="upload-input">{props.children}</label>
    </>
  );
};
