import Card from "@mui/material/Card";
import { css } from "./styling";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import { useFilePicker } from "use-file-picker";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";

export default function UploadCard() {
  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    readAs: "BinaryString",
    accept: ".3mf",
  });
  const router = useRouter();
  const [fileSelected, setFileSelected] = useState(false);

  const onClick = useCallback(() => {
    if (!fileSelected) {
      openFileSelector();
    }
  }, [openFileSelector, fileSelected]);

  useEffect(() => {
    if (loading) {
      setFileSelected(true);
    }
  }, [loading]);

  useEffect(() => {
    if (filesContent.length > 0) {
      router.push({
        pathname: "/printing/upload",
        // query: { file: filesContent[0].content },
      });
    }
  }, [filesContent, router]);

  return (
    <Card sx={{ display: "flex", ...css }} onClick={onClick}>
      {fileSelected ? (
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
  );
}
