import Card from "@mui/material/Card";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import { navigateToPreview } from "./navigate_to_preview";
import { ClickToUpload } from "../core/click_to_upload";
import { useBoolean } from "../hooks/use_boolean";
import { IS3ErrorUploadResponse, IS3ValidUploadResponse } from '../hooks/upload_to_s3';

export default function UploadCard() {
  const router = useRouter();
  const [uploading, setters] = useBoolean(false);

  return (
    <ClickToUpload
      folder="models"
      fileFormatsAccepted={["stl", "3mf"]}
      onStartUpload={setters.turnOn}
      onUploadError={(response: IS3ErrorUploadResponse) => {
        // TODO: Make this a user notification
        console.log(response.error);
        setters.turnOff();
      }}
      onUploadFinished={(response: IS3ValidUploadResponse) => {
        setters.turnOff();
        navigateToPreview(router, response.key);
      }}
    >
      <Card sx={{ display: "flex", height: 150 }} className="cardWithHover">
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
    </ClickToUpload>
  );
}
