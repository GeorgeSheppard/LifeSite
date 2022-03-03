import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useState, MouseEvent, ChangeEvent, useCallback } from "react";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { v4 as uuidv4 } from "uuid";
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
  TemperatureRange,
  LightLevel,
  WateringAmount,
  addOrUpdatePlant,
} from "../../store/reducers/plants";
import UploadIcon from "@mui/icons-material/Upload";
import CardMedia from "@mui/material/CardMedia";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import useUpload from "../hooks/upload_to_server";
import CircularProgress from "@mui/material/CircularProgress";
import {
  IErrorUploadResponse,
  IValidUploadResponse,
} from "../../pages/api/filesUpload";

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
  const [uploading, setUploading] = useState(false);
  const [uuid] = useState<PlantUuid>(props.uuid);
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
  const [wateringLevel, setWateringLevel] = useState(plantData.wateringKey);
  const [lightLevel, setLightLevel] = useState(plantData.lightLevelKey);

  const handleSliderChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      setTemperatureRange(newValue as TemperatureRange);
    },
    [setTemperatureRange]
  );

  const { uploadFile } = useUpload({
    onUploadFinished: (response: IValidUploadResponse) => {
      setImages((images) =>
        images.concat({ path: response.writePath, timestamp: Date.now() })
      );
      setUploading(false);
    },
    onUploadError: (response: IErrorUploadResponse) => {
      // TODO: Make this a user notification
      console.log(response.error);
      setUploading(false);
    },
    onStartUpload: () => setUploading(true),
    folder: "images",
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

  const dispatchPlant = useCallback(() => {
    const close = props.closeBackdrop;

    dispatch(
      addOrUpdatePlant({
        uuid,
        name,
        description,
        lightLevelKey: lightLevel,
        wateringKey: wateringLevel,
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
              <input
                type="file"
                id="upload-image-input"
                style={{ display: "none" }}
                multiple={false}
                onChange={getAndUploadFile}
                accept=".png,.jpg"
              />
              <label htmlFor="upload-image-input">
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
              </label>
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
            <Slider
              key="TemperatureSlider"
              value={temperatureRange}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              getAriaValueText={(value: number) => `${value}°C`}
              min={0}
              max={35}
              marks={[
                { label: "0°C", value: 0 },
                { label: "25°C", value: 25 },
                { label: "35°C", value: 35 },
              ]}
            />
            <div
              key="LightLevelCheckboxes"
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 15,
              }}
            >
              {Object.entries(LightLevel).map(
                ([key, data]: [string, { tooltip: string; icon: any }]) => {
                  return (
                    <FormControlLabel
                      key={data.tooltip}
                      value="top"
                      control={<Checkbox checked={key === lightLevel} />}
                      label={
                        <Tooltip title={data.tooltip}>{data.icon}</Tooltip>
                      }
                      labelPlacement="top"
                      onClick={() => setLightLevel(key as LightLevelKeys)}
                    />
                  );
                }
              )}
            </div>
            <div
              key="WateringAmountCheckboxes"
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 15,
                paddingBottom: 15,
              }}
            >
              {Object.entries(WateringAmount).map(
                ([key, data]: [string, { tooltip: string; icon: any }]) => {
                  return (
                    <FormControlLabel
                      key={data.tooltip}
                      value="top"
                      control={<Checkbox checked={key === wateringLevel} />}
                      label={
                        <Tooltip title={data.tooltip}>
                          <Icon>
                            <Image
                              src={data.icon.src}
                              width={data.icon.width}
                              height={data.icon.height}
                              alt="watering level"
                            />
                          </Icon>
                        </Tooltip>
                      }
                      labelPlacement="top"
                      onClick={() =>
                        setWateringLevel(key as WateringAmountKeys)
                      }
                    />
                  );
                }
              )}
            </div>
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
            <Box
              key="BottomButtonsCancelSave"
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "10px",
              }}
            >
              <Button
                component="button"
                variant="outlined"
                startIcon={<CancelIcon />}
                sx={{ flexGrow: 0.4 }}
                onClick={props.closeBackdrop}
              >
                Exit
              </Button>
              <Button
                component="button"
                variant="contained"
                endIcon={<SaveIcon />}
                sx={{ flexGrow: 0.4 }}
                onClick={dispatchPlant}
                disabled={name.length === 0}
              >
                Save
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
