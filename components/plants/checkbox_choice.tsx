import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Image from "next/image";
import { CSSProperties } from "react";
import { Brightness4, Brightness5, Brightness6 } from "@mui/icons-material";
import {
  Checkboxes,
  WateringAmountKeys,
  LightLevelKeys,
} from "../../store/reducers/plants/types";
import LittleWater from "../../public/images/little_water.svg";
import NormalWater from "../../public/images/normal_water.svg";
import LotsWater from "../../public/images/lots_water.svg";

export const WateringAmount: Checkboxes = {
  [WateringAmountKeys.LITTLE]: {
    tooltip: "Likes small amounts of water",
    icon: LittleWater,
  },
  [WateringAmountKeys.NORMAL]: {
    tooltip: "Keep the soil moist",
    icon: NormalWater,
  },
  [WateringAmountKeys.LOTS]: {
    tooltip: "This plant loves water",
    icon: LotsWater,
  },
};

export const LightLevel: Checkboxes = {
  [LightLevelKeys.INDIRECT_SUN]: {
    tooltip: "Prefers to be slightly shaded with sun",
    icon: <Brightness4 />,
  },
  [LightLevelKeys.SHADE]: {
    tooltip: "Prefers to be in the shade",
    // Don't ask me why brightness 6 looks less bright than brightness 5
    icon: <Brightness6 />,
  },
  [LightLevelKeys.DIRECT_SUN]: {
    tooltip: "This plant loves light, place in direct sunlight",
    icon: <Brightness5 />,
  },
};

export interface ICheckboxChoiceProps {
  currentChecked: string;
  checkboxes: Checkboxes;
  setCurrentChecked: (key: string) => void;
  style?: CSSProperties | undefined;
}

export const CheckboxChoice = (props: ICheckboxChoiceProps) => {
  return (
    <div key="Checkboxes" style={props.style}>
      {Object.entries(props.checkboxes).map(
        ([key, data]: [string, { tooltip: string; icon: any }]) => {
          return (
            <FormControlLabel
              key={data.tooltip}
              value="top"
              control={<Checkbox checked={key === props.currentChecked} />}
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
              // I would like to access the generic here, but I can't :(
              onClick={() => props.setCurrentChecked(key as any)}
            />
          );
        }
      )}
    </div>
  );
};
