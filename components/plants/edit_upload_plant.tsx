import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import { ChangeEvent, useCallback, useState } from "react";
import { addOrUpdatePlant } from "../../store/reducers/plants/plants";
import {
  LightLevelKeys,
  PlantUuid,
  WateringAmountKeys,
} from "../../store/reducers/plants/types";
import { ExitSaveButtons } from "../cards/exit_save_buttons";
import { UploadDisplayImages } from "../cards/upload_and_display_images";
import { stopPropagation } from "../cards/utilities";
import { useMutateAndStore } from "../hooks/user_data";
import { usePlants } from "../hooks/use_data";
import { LightLevel, WateringAmount } from "./checkbox_choice";
import { TemperatureSlider } from "./temperature_slider";

export interface IEditUploadPlant {
  /**
   * New plant will have a uuid but no data in store
   */
  uuid: PlantUuid;
  closeBackdrop: () => void;
}

export const EditUploadPlant = (props: IEditUploadPlant) => {
  const { mutateAsync } = useMutateAndStore(addOrUpdatePlant);
  const [uuid] = useState<PlantUuid>(props.uuid);
  // Return either the existing plant data, or a default form
  // Much easier to work with fully defined properties
  const plantData = usePlants().data.plants[uuid] ?? {
    uuid,
    name: "",
    description: "",
    lightLevelKey: LightLevelKeys.INDIRECT_SUN,
    wateringKey: WateringAmountKeys.NORMAL,
    temperatureRange: [12, 25],
    images: [],
    reminders: [],
  };
  const [name, setName] = useState(plantData.name);
  const [images, setImages] = useState(plantData.images);
  const [description, setDescription] = useState(plantData.description);
  const [temperatureRange, setTemperatureRange] = useState(
    plantData.temperatureRange
  );

  const [wateringLevel, setWateringLevel] = useState(plantData.wateringKey);
  const [lightLevel, setLightLevel] = useState(plantData.lightLevelKey);

  const dispatchPlant = useCallback(async () => {
    const close = props.closeBackdrop;

    await mutateAsync({
      uuid,
      name,
      description,
      lightLevelKey: lightLevel,
      wateringKey: wateringLevel,
      temperatureRange,
      images,
      // TODO: No reminders UI yet
      reminders: [],
    });
    close();
  }, [
    uuid,
    name,
    description,
    lightLevel,
    wateringLevel,
    temperatureRange,
    images,
    props.closeBackdrop,
    mutateAsync,
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
            <UploadDisplayImages images={images} setImages={setImages} />
            <TemperatureSlider
              temperatureRange={temperatureRange}
              setTemperatureRange={setTemperatureRange}
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
