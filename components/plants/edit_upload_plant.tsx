import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useState, MouseEvent, ChangeEvent, useCallback } from "react";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import {
  PlantUuid,
  IPlant,
  WateringAmountKeys,
  LightLevelKeys,
  LightLevel,
  WateringAmount,
  addOrUpdatePlant,
} from "../../store/reducers/plants";
import UploadIcon from "@mui/icons-material/Upload";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import {
  IErrorUploadResponse,
  IValidUploadResponse,
} from "../../pages/api/filesUpload";
import { ClickToUpload } from "../core/click_to_upload";
import { TemperatureSlider } from "./temperature_slider";
import { useBoolean } from "../hooks/use_boolean";
import { ExitSaveButtons } from "../cards/exit_save_buttons";
import { CheckboxChoice } from "./checkbox_choice";

export interface IEditUploadPlant {
  /**
   * New plant will have a uuid but no data in store
   */
  uuid: string;
  closeBackdrop: () => void;
}

const stopPropagation = (event: MouseEvent<HTMLElement>) => {
  event.stopPropagation();
};

export const EditUploadPlant = (props: IEditUploadPlant) => {
  const dispatch = useAppDispatch();
  const [uuid] = useState<PlantUuid>(props.uuid);
  const [uploading, setters] = useBoolean(false);
  // Return either the existing plant data, or a default form
  // Much easier to work with fully defined properties
  const plantData: IPlant = useAppSelector((store) => {
    if (uuid in store.plants.plants) {
      return store.plants.plants[uuid];
    } else {
      return {
        uuid,
        name: "",
        description: "",
        lightLevelKey: LightLevelKeys.INDIRECT_SUN,
        wateringKey: WateringAmountKeys.NORMAL,
        temperatureRange: [12, 25],
        images: [],
        reminders: [],
      };
    }
  });
  const [name, setName] = useState(plantData.name);
  const [images, setImages] = useState(plantData.images);
  const [description, setDescription] = useState(plantData.description);
  const [temperatureRange, setTemperatureRange] = useState(
    plantData.temperatureRange
  );

  // TODO: Have to use string here as the checkboxes component cannot handle the generic types
  const [wateringLevel, setWateringLevel] = useState<string>(
    plantData.wateringKey
  );
  const [lightLevel, setLightLevel] = useState<string>(plantData.lightLevelKey);

  const dispatchPlant = useCallback(() => {
    const close = props.closeBackdrop;

    dispatch(
      addOrUpdatePlant({
        uuid,
        name,
        description,
        lightLevelKey: lightLevel as LightLevelKeys,
        wateringKey: wateringLevel as WateringAmountKeys,
        temperatureRange,
        images,
        // TODO: No reminders UI yet
        reminders: [],
      })
    );
    close();
  }, [
    dispatch,
    uuid,
    name,
    description,
    lightLevel,
    wateringLevel,
    temperatureRange,
    images,
    props.closeBackdrop,
  ]);

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container alignItems="center" justifyContent="center">
        <Grid item key="edit_upload" xs={12} sm={6} md={4}>
          <Card sx={{ padding: 4 }} onClick={stopPropagation}>
            <TextField
              key="NameTextField"
              fullWidth
              label={"Name"}
              value={name}
              id="name"
              variant="standard"
              margin="none"
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setName(event.target.value)
              }
            />
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
                onUploadError={(response: IErrorUploadResponse) => {
                  // TODO: Make this a user notification
                  console.log(response.error);
                  setters.turnOff();
                }}
                onUploadFinished={(response: IValidUploadResponse) => {
                  setImages((images) =>
                    images.concat({
                      path: response.writePath,
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
                    <Box
                      component="div"
                      sx={{ display: "flex", margin: "auto" }}
                    >
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
              {images.map((image) => {
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
                        <CardMedia
                          src={image.path}
                          component="img"
                          height={100}
                        />
                      </Box>
                      <Box component="div" sx={{ flexGrow: 0.5 }} />
                    </Paper>
                  </div>
                );
              })}
            </div>
            <TemperatureSlider
              temperatureRange={temperatureRange}
              setTemperatureRange={setTemperatureRange}
            />
            <CheckboxChoice
              currentChecked={lightLevel}
              checkboxes={LightLevel}
              setCurrentChecked={setLightLevel}
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 15,
              }}
            />
            <CheckboxChoice
              currentChecked={wateringLevel}
              checkboxes={WateringAmount}
              setCurrentChecked={setWateringLevel}
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 15,
                paddingBottom: 15,
              }}
            />
            <TextField
              key="DescriptionTextBox"
              fullWidth
              label={"Description"}
              value={description}
              id="description"
              variant="standard"
              multiline
              maxRows={12}
              margin="none"
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(event.target.value)
              }
            />
            <ExitSaveButtons
              exitOnClick={props.closeBackdrop}
              saveOnClick={dispatchPlant}
              saveDisabled={name.length === 0}
              buttonSx={{ flexGrow: 0.4 }}
              boxSx={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "10px",
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
