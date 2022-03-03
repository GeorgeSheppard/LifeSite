import { Brightness4, Brightness5, Brightness6 } from "@mui/icons-material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFullStoreState } from "../store";
import { Image } from "./types";
import LittleWater from "../../public/images/little_water.svg";
import NormalWater from "../../public/images/normal_water.svg";
import LotsWater from "../../public/images/lots_water.svg";

export interface IReminder {
  startTimestamp: number;
  periodHours: number;
  title: string;
  description?: string;
  icon: string;
}

export enum LightLevelKeys {
  INDIRECT_SUN = "INDIRECT_SUN",
  SHADE = "SHADE",
  DIRECT_SUN = "DIRECT_SUN",
}

export const LightLevel: {
  [key in LightLevelKeys]: { tooltip: string; icon: any };
} = {
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

export enum WateringAmountKeys {
  LITTLE = "LITTLE",
  NORMAL = "NORMAL",
  LOTS = "LOTS",
}

export const WateringAmount: {
  [key in WateringAmountKeys]: { tooltip: string; icon: any };
} = {
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

export type TemperatureRange = [low: number, high: number];

export type PlantUuid = string;

export interface IPlant {
  uuid: PlantUuid;
  name: string;
  description: string;
  lightLevelKey: LightLevelKeys;
  wateringKey: WateringAmountKeys;
  temperatureRange: TemperatureRange;
  images: Image[];
  reminders: IReminder[];
}

export interface IPlantsState {
  cards: PlantUuid[];
  plants: { [key: PlantUuid]: IPlant };
}

const initialState: IPlantsState = {
  cards: [],
  plants: {},
};

export const plantsSlice = createSlice({
  name: "plants",
  initialState,
  reducers: {
    addOrUpdatePlant: (state, action: PayloadAction<IPlant>) => {
      const plant = action.payload;
      const { uuid } = plant;
      const existsAlready = uuid in state.plants;
      state.plants[uuid] = plant;
      if (!existsAlready) {
        state.cards.unshift(uuid);
      }
    },
    deletePlant: (state, action: PayloadAction<PlantUuid>) => {
      const uuid = action.payload;
      if (uuid in state.plants) {
        delete state.plants[uuid];
        state.cards = state.cards.filter((cardUuid) => cardUuid !== uuid);
      }
    },
  },
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      return action.payload.plants ?? initialState;
    },
    "user/logout": (state) => {
      return initialState;
    },
  },
});

export const { addOrUpdatePlant, deletePlant } = plantsSlice.actions;

export default plantsSlice.reducer;
