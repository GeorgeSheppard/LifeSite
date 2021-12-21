import Card from "@mui/material/Card";
import { css } from "./styling";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import useUpload from "../hooks/upload_to_server";

export default function UploadCard() {
  const router = useRouter();

  const [uploading, setUploading] = useState(false);

  const onUploadFinished = useCallback(() => {
    router.push("/printing/upload");
  }, [router]);

  const onUploadError = useCallback((statusText: string) => {
    console.log(statusText);
  }, []);

  const onSaveToClient = useCallback(
    (file: File) => {
      setUploading(true);
    },
    [setUploading]
  );

  const { fullUpload } = useUpload({
    onUploadFinished,
    onUploadError,
    onSaveToClient,
    folder: "images",
  });

  return (
    <>
      <input
        type="file"
        id="upload-input"
        style={{ display: "none" }}
        onChange={fullUpload}
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
