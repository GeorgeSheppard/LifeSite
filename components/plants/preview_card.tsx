import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Tooltip,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../store/hooks/hooks";
import {
  LightLevel,
  PlantUuid,
  WateringAmount,
} from "../../store/reducers/plants";
import { css } from "../cards/styling";
import { useMemo, useState, useCallback, MouseEvent } from "react";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import Image from "next/image";

export interface IPlantPreview {
  uuid: PlantUuid;
  select?: () => void;
}

export const PlantPreview = (props: IPlantPreview) => {
  const plant = useAppSelector((store) => store.plants.plants[props.uuid]);
  const [imageIndex, setImageIndex] = useState(0);
  const setImageIndexWrapped = useCallback(
    (index: number) => {
      const numImages = plant.images.length;
      setImageIndex(((index % numImages) + numImages) % numImages);
    },
    [setImageIndex, plant.images.length]
  );
  const changeIndex = useCallback(
    (step: number) => (event: MouseEvent<HTMLElement>) => {
      setImageIndexWrapped(imageIndex + step);
      event.stopPropagation();
    },
    [setImageIndexWrapped, imageIndex]
  );

  const lightLevel = useMemo(
    () => LightLevel[plant.lightLevelKey],
    [plant.lightLevelKey]
  );
  const wateringLevel = useMemo(
    () => WateringAmount[plant.wateringKey],
    [plant.wateringKey]
  );

  return (
    <Card sx={{ ...css, height: "100%" }} onClick={() => props.select?.()}>
      <CardActionArea>
        <CardHeader title={plant.name} />
        {plant.images.length > 0 ? (
          <div style={{ position: "relative" }}>
            <CardMedia
              src={plant.images[imageIndex].image}
              component="img"
              height="300px"
            />
            <IconButton
              onClick={changeIndex(-1)}
              sx={{ position: "absolute", top: "50%" }}
            >
              <KeyboardArrowLeftIcon component="svg" />
            </IconButton>
            <IconButton
              onClick={changeIndex(1)}
              sx={{ position: "absolute", top: "50%", right: 0 }}
            >
              <KeyboardArrowRightIcon component="svg" />
            </IconButton>
          </div>
        ) : (
          <CardMedia
            src={"/images/plants.jpg"}
            component="img"
            height="300px"
          />
        )}
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
                {plant.temperatureRange[0] + "\xB0C"}
              </Typography>
            </div>
          </Tooltip>
          <Tooltip title="Maximum temperature">
            <div>
              <WbSunnyIcon />
              <Typography align="center">
                {plant.temperatureRange[1] + "\xB0C"}
              </Typography>
            </div>
          </Tooltip>
        </Box>
        <CardContent className={"content"}>
          <Typography>{plant.description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
