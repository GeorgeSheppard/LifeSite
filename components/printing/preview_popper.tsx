import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  RefObject,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAppDispatch } from "../../store/hooks/hooks";
import { addModel, IModelProps } from "../../store/reducers/printing";
import { v4 as uuidv4 } from "uuid";
import useUpload from "../hooks/upload_to_server";
import { IValidUploadResponse } from "../../pages/api/filesUpload";
import { ICanvasScreenshotterRef } from "./canvas_screenshotter";
import { ExitSaveButtons } from "../cards/exit_save_buttons";

export interface IPreviewPopperProps {
  open: boolean;
  anchorEl: HTMLElement;
  screenshotRef: RefObject<ICanvasScreenshotterRef>;
  uuid: string;
  existingData?: IModelProps;
}

export const PreviewPopper = (props: IPreviewPopperProps) => {
  const { screenshotRef, existingData } = props;

  const [screenshot, setScreenshot] = useState<string | undefined>();

  useEffect(() => {
    if (screenshotRef.current) {
      setScreenshot(screenshotRef.current.takeScreenshot());
    }
  }, [screenshotRef, setScreenshot]);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { uploadFile } = useUpload({
    folder: "images",
    onUploadFinished: (response: IValidUploadResponse) => {
      dispatch(
        addModel({
          filename: name,
          description,
          image: {
            path: response.writePath,
            timestamp: Date.now(),
          },
          // TODO: Better way of managing types with nextjs, seems to be very hard
          // to work with, need custom type definitions for the pages
          modelSrc: router.query.writePath as any as string,
          uuid,
          cameraParams: screenshotRef.current?.getCameraParams(),
        })
      );
      onExit();
    },
    onUploadError: (err) => console.log(err),
  });

  const [name, setName] = useState<string>(existingData?.filename ?? "");
  const [description, setDescription] = useState<string>(
    existingData?.description ?? ""
  );
  const [uuid] = useState(existingData?.uuid ?? uuidv4());

  const onExit = useCallback(() => {
    router.push("/printing");
  }, [router]);

  const onSave = useCallback(
    (blob: Blob | null) => {
      const filename = `${uuid}_preview.png`;
      if (blob) {
        uploadFile(new File([blob], filename), filename);
      }
    },
    [uploadFile, uuid]
  );

  return (
    <Popper id="preview-popper" open={props.open} anchorEl={props.anchorEl}>
      <Paper elevation={3} sx={{ width: "60vw", maxWidth: "550px" }}>
        <Card component="div">
          <Box
            component="div"
            sx={{
              display: "flex",
              flexGrow: 1,
              height: 150,
              justifyContent: "space-between",
            }}
          >
            <Box
              component="div"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1, flexShrink: 0 }}>
                <TextField
                  id="standard-basic"
                  label="Name"
                  variant="standard"
                  margin="none"
                  sx={{ paddingBottom: "10px" }}
                  value={name}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setName(event.target.value)
                  }
                  fullWidth
                />
                <TextField
                  id="standard-basic"
                  label="Description"
                  variant="standard"
                  margin="none"
                  value={description}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(event.target.value)
                  }
                  fullWidth
                />
              </CardContent>
            </Box>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexShrink: 1,
                overflow: "hidden",
                width: 150,
                minWidth: 150,
              }}
            >
              <CardMedia component="img" src={screenshot} />
            </Box>
          </Box>
          <ExitSaveButtons
            exitOnClick={onExit}
            saveOnClick={() => screenshotRef.current?.getBlob(onSave)}
            saveDisabled={name.length === 0}
            buttonSx={{
              width: "25vw",
              maxWidth: 240,
            }}
            boxSx={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "10px",
              paddingBottom: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          />
        </Card>
      </Paper>
    </Popper>
  );
};
