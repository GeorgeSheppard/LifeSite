import Card from "@mui/material/Card";
import { css } from "./styling";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useState } from "react";
import { useRouter } from "next/router";
import useUpload from "../hooks/upload_to_server";
import { IErrorUploadResponse } from "../../pages/api/filesUpload";
import { useAppDispatch } from "../../store/hooks/hooks";

export default function UploadCard() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const { uploadFile } = useUpload({
    onUploadFinished: (response) => {
      router.push(
        {
          pathname: `/printing/preview`,
          query: { writePath: response.writePath },
        },
        "/printing/preview"
      );
    },
    onUploadError: (response: IErrorUploadResponse) => {
      // TODO: Make this a user notification
      console.log(response.error);
      setUploading(false);
    },
    onStartUpload: () => setUploading(true),
    folder: "models",
  });

  return (
    <>
      <input
        type="file"
        id="upload-input"
        style={{ display: "none" }}
        onChange={uploadFile}
        multiple={false}
        accept=".stl"
      />
      <label htmlFor="upload-input">
        <Card sx={{ display: "flex", ...css }}>
          {uploading ? (
            <Box component="div" sx={{ width: "80%", margin: "auto" }}>
              <LinearProgress />
            </Box>
          ) : (
            <>
              <Box component="div" sx={{ flexGrow: 0.5 }} />
              <Box component="div" sx={{ display: "flex", margin: "auto" }}>
                <UploadIcon fontSize="large" />
              </Box>
              <Box component="div" sx={{ flexGrow: 0.5 }} />
            </>
          )}
        </Card>
      </label>
    </>
  );
}
