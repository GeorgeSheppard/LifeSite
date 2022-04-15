import { useCallback, ChangeEvent, useMemo, ReactElement } from "react";
import useUploadToS3, { IS3ErrorUploadResponse, IS3ValidUploadResponse } from "../hooks/upload_to_s3";

export interface IClickToUploadProps {
  onUploadFinished?: (response: IS3ValidUploadResponse) => void;
  onUploadError?: (response: IS3ErrorUploadResponse) => void;
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
  const { uploadFile } = useUploadToS3({
    onUploadFinished: props.onUploadFinished,
    onUploadError: props.onUploadError,
    onStartUpload: props.onStartUpload,
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
