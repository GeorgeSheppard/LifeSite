import { Box, Icon, Tooltip, IconButton } from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { deletePlant } from "../../store/reducers/plants/plants";
import { useMemo, useCallback } from "react";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Image from "next/image";
import { WrappedCardMedia } from "../cards/wrapped_card_media";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useBoolean } from "../hooks/use_boolean";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { PlantUuid } from "../../store/reducers/plants/types";
import { LightLevel, WateringAmount } from "./checkbox_choice";
import { usePlants } from "../hooks/use_data";
import { useMutateAndStore } from "../hooks/user_data";

export interface IPlantPreview {
  uuid: PlantUuid;
  select?: () => void;
}

const degreesC = "\xB0C";

export const PlantPreview = (props: IPlantPreview) => {
  const plant = usePlants().data?.plants[props.uuid];
  const { mutate } = useMutateAndStore(deletePlant);
  const [dialogOpen, setters] = useBoolean(false);

  if (!plant) {
    return null;
  }

  const lightLevel = LightLevel[plant.lightLevelKey];
  const wateringLevel = WateringAmount[plant.wateringKey];

  return (
    <>
      <Dialog open={dialogOpen} onClose={setters.turnOff}>
        <DialogTitle>{"Delete this plant?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this plant? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setters.turnOff}>{"No, cancel"}</Button>
          <Button onClick={() => mutate(props.uuid)} autoFocus>
            {"Yes, I'm sure"}
          </Button>
        </DialogActions>
      </Dialog>
      <Card
        sx={{ height: "100%" }}
        className="cardWithHover"
        onClick={() => props.select?.()}
      >
        <CardActionArea>
          <div style={{ display: "flex", padding: 16 }}>
            <Typography fontSize={24} fontWeight={400}>
              {plant.name}
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <IconButton
              onClick={(event) => {
                event?.stopPropagation();
                setters.turnOn();
              }}
              size="small"
              sx={{ alignSelf: "center", pr: 1 }}
            >
              <DeleteIcon fontSize="small" htmlColor="#7d2020" />
            </IconButton>
          </div>
          <WrappedCardMedia images={plant.images} />
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-around",
              paddingTop: 3,
              paddingBottom: 1,
            }}
          >
            <Tooltip title={lightLevel.tooltip}>{lightLevel.icon}</Tooltip>
            <Tooltip title={wateringLevel.tooltip}>
              <Icon>
                <Image
                  src={wateringLevel.icon.src}
                  width={wateringLevel.icon.width}
                  height={wateringLevel.icon.height}
                  alt="watering level"
                />
              </Icon>
            </Tooltip>
            <Tooltip title="Minimum temperature">
              {/* Note: <> doesn't work */}
              <div>
                <AcUnitIcon />
                <Typography align="center">
                  {plant.temperatureRange[0] + degreesC}
                </Typography>
              </div>
            </Tooltip>
            <Tooltip title="Maximum temperature">
              <div>
                <WbSunnyIcon />
                <Typography align="center">
                  {plant.temperatureRange[1] + degreesC}
                </Typography>
              </div>
            </Tooltip>
          </Box>
          <CardContent className={"content"}>
            <Typography>{plant.description}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};
