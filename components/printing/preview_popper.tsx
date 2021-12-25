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
import { ChangeEvent, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { addModel } from "../../store/reducers/printing";
import { v4 as uuidv4 } from "uuid";

export interface IPreviewPopperProps {
  open: boolean;
  anchorEl: HTMLElement;
  screenshot: string;
  uuid: string;
}

export const PreviewPopper = (props: IPreviewPopperProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const existingData = useAppSelector((store) => {
    if (props.uuid.length > 0) {
      return store.printing.models[props.uuid];
    }
  });

  const [name, setName] = useState<string>(existingData?.filename ?? "");
  const [description, setDescription] = useState<string>(
    existingData?.description ?? ""
  );

  const onExit = useCallback(() => {
    router.push("/printing");
  }, [router]);

  const onSave = useCallback(() => {
    dispatch(
      addModel({
        filename: name,
        description,
        imageSrc: props.screenshot,
        // TODO: Better way of managing types with nextjs, seems to be very hard
        // to work with, need custom type definitions for the pages
        modelSrc: router.query.writePath as any as string,
        uuid: props.uuid.length > 0 ? props.uuid : uuidv4(),
      })
    );
    onExit();
  }, [
    dispatch,
    props.screenshot,
    name,
    description,
    router.query.writePath,
    onExit,
    props.uuid,
  ]);

  return (
    <Popper id="preview-popper" open={props.open} anchorEl={props.anchorEl}>
      <Paper elevation={3} sx={{ width: "60vw" }}>
        <Card component="div">
          <Box component="div" sx={{ display: "flex", height: 150 }}>
            <Box
              component="div"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flex: "1 0 auto" }}>
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
                overflow: "hidden",
                width: 150,
                minWidth: 150,
              }}
            >
              <CardMedia component="img" src={props.screenshot} />
            </Box>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            <Button
              component="button"
              variant="outlined"
              startIcon={<CancelIcon />}
              sx={{
                width: "25vw",
              }}
              onClick={onExit}
            >
              Exit
            </Button>
            <Button
              component="button"
              variant="contained"
              endIcon={<SaveIcon />}
              sx={{
                width: "25vw",
              }}
              onClick={onSave}
              disabled={name.length === 0}
            >
              Save
            </Button>
          </Box>
        </Card>
      </Paper>
    </Popper>
  );
};
