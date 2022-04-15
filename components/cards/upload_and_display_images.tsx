import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import UploadIcon from "@mui/icons-material/Upload";
import { ClickToUpload } from "../core/click_to_upload";
import { useBoolean } from "../hooks/use_boolean";
import { Image } from "../../store/reducers/types";
import { SetStateAction, Dispatch } from "react";
import { IS3ErrorUploadResponse, IS3ValidUploadResponse } from "../hooks/upload_to_s3";
import { S3CardMedia } from "./s3_card_media";

export interface IUploadDisplayImagesProps {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
}

export const UploadDisplayImages = (props: IUploadDisplayImagesProps) => {
  const [uploading, setters] = useBoolean(false);

  return (
    <div
      key="UploadAndImages"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingBottom: 20,
      }}
    >
      <ClickToUpload
        folder="images"
        fileFormatsAccepted={["png", "jpg"]}
        onStartUpload={setters.turnOn}
        onUploadError={(response: IS3ErrorUploadResponse) => {
          // TODO: Make this a user notification
          console.log(response.error);
          setters.turnOff();
        }}
        onUploadFinished={async (response: IS3ValidUploadResponse) => {
          props.setImages((images) =>
            images.concat({
              key: response.key,
              timestamp: Date.now(),
            })
          );
          setters.turnOff();
        }}
      >
        <div style={{ paddingTop: 15 }}>
          <Paper
            elevation={1}
            sx={{ width: 100, height: 100, display: "flex" }}
          >
            <Box component="div" sx={{ flexGrow: 0.5 }} />
            <Box component="div" sx={{ display: "flex", margin: "auto" }}>
              {uploading ? (
                <CircularProgress />
              ) : (
                <UploadIcon fontSize="large" />
              )}
            </Box>
            <Box component="div" sx={{ flexGrow: 0.5 }} />
          </Paper>
        </div>
      </ClickToUpload>
      {props.images.map((image) => {
        return (
          <div style={{ paddingTop: 15 }} key={image.timestamp}>
            <Paper
              elevation={1}
              sx={{
                width: 100,
                height: 100,
                minWidth: 100,
                display: "flex",
              }}
            >
              <Box component="div" sx={{ flexGrow: 0.5 }} />
              <Box
                component="div"
                sx={{
                  display: "flex",
                  margin: "auto",
                }}
              >
                <S3CardMedia s3Key={image.key} height="100px" />
              </Box>
              <Box component="div" sx={{ flexGrow: 0.5 }} />
            </Paper>
          </div>
        );
      })}
    </div>
  );
};
