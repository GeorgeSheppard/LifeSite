import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import UploadIcon from "@mui/icons-material/Upload";
import IconButton from "@mui/material/IconButton";

import { ClickToUpload } from "../click_to_upload";
import { useBoolean } from "../hooks/use_boolean";
import { Image } from "../../../core/types/general";
import { SetStateAction, Dispatch, useCallback } from "react";
import {
  IS3ErrorUploadResponse,
  IS3ValidUploadResponse,
} from "../../../core/s3/hooks/upload_to_s3";
import { S3CardMedia } from "./s3_card_media";
import { Delete } from "@mui/icons-material";

export interface IUploadDisplayImagesProps {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
}

export const UploadDisplayImages = (props: IUploadDisplayImagesProps) => {
  const [uploading, setters] = useBoolean(false);

  const deleteImage = useCallback(
    (index) => {
      const setImages = props.setImages;
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages.splice(index, 1);
        return newImages;
      });
    },
    [props.setImages]
  );

  return (
    <div
      key="UploadAndImages"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
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
        {(loading) => (
          <div style={{ paddingTop: 15 }}>
            <Paper
              elevation={1}
              sx={{ width: 100, height: 100, display: "flex" }}
            >
              <Box component="div" sx={{ flexGrow: 0.5 }} />
              <Box component="div" sx={{ display: "flex", margin: "auto" }}>
                {uploading || loading ? (
                  <CircularProgress />
                ) : (
                  <UploadIcon fontSize="large" />
                )}
              </Box>
              <Box component="div" sx={{ flexGrow: 0.5 }} />
            </Paper>
          </div>
        )}
      </ClickToUpload>
      {props.images.map((image, index) => {
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
                  position: "relative",
                }}
              >
                <S3CardMedia s3Key={image.key} height="100px" />
                <IconButton
                  sx={{ position: "absolute", top: "0%", right: "0%" }}
                  onClick={() => deleteImage(index)}
                >
                  <Delete htmlColor="white" />
                </IconButton>
              </Box>
              <Box component="div" sx={{ flexGrow: 0.5 }} />
            </Paper>
          </div>
        );
      })}
    </div>
  );
};
