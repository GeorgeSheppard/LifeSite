import { Brightness4, Brightness5, Brightness6 } from "@mui/icons-material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFullStoreState } from "../store";
import { Checkboxes, Image } from "./types";
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

export enum WateringAmountKeys {
  LITTLE = "LITTLE",
  NORMAL = "NORMAL",
  LOTS = "LOTS",
}

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

const initialState: IPlantsState = JSON.parse('{"cards":["307529b3-c4c2-4906-a11c-f6fa901627d4","b8ce3355-ac89-423c-924a-98dfb4fc6472","db920449-e474-45f0-885a-207fafbc0a7d","c0e0e0b3-5f55-4ea5-8cdf-3d297000e877","a5921278-cc1d-4f47-8bb1-b18e5fe98e47","132adf3b-14e9-4b2b-a9b2-41b7631b97b5"],"plants":{"132adf3b-14e9-4b2b-a9b2-41b7631b97b5":{"uuid":"132adf3b-14e9-4b2b-a9b2-41b7631b97b5","name":"Not a plant","description":"Not a plant as you can tell","lightLevelKey":"SHADE","wateringKey":"LITTLE","temperatureRange":[4,28],"images":[{"key":"31ae6d9d-60f4-46cb-bddc-7fd2810d7e7d/images/f0d5d9fe-a0d6-47c7-aa3e-77e6dee31478_Thai-Curry-Sauce-71.jpg","timestamp":1650394686281}],"reminders":[]},"a5921278-cc1d-4f47-8bb1-b18e5fe98e47":{"uuid":"a5921278-cc1d-4f47-8bb1-b18e5fe98e47","name":"Bonsai 3","description":"","lightLevelKey":"INDIRECT_SUN","wateringKey":"LITTLE","temperatureRange":[15,23],"images":[{"key":"31ae6d9d-60f4-46cb-bddc-7fd2810d7e7d/images/98bc7b18-eaa7-498d-a5f0-e2c98df2e69e_IMG_20220409_174003.jpg","timestamp":1650402921638}],"reminders":[]},"c0e0e0b3-5f55-4ea5-8cdf-3d297000e877":{"uuid":"c0e0e0b3-5f55-4ea5-8cdf-3d297000e877","name":"Lego Bonsai","description":"","lightLevelKey":"DIRECT_SUN","wateringKey":"LITTLE","temperatureRange":[0,35],"images":[{"key":"31ae6d9d-60f4-46cb-bddc-7fd2810d7e7d/images/eaa63a06-98f1-4262-b91f-a7454fda5049_IMG_20211228_165920_BURST001_COVER (2).jpg","timestamp":1650403067884}],"reminders":[]},"db920449-e474-45f0-885a-207fafbc0a7d":{"uuid":"db920449-e474-45f0-885a-207fafbc0a7d","name":"Big Plant","description":"","lightLevelKey":"INDIRECT_SUN","wateringKey":"LOTS","temperatureRange":[17,22],"images":[{"key":"31ae6d9d-60f4-46cb-bddc-7fd2810d7e7d/images/9cdf9d5b-93e1-4135-b8ed-587f9d7ed999_IMG_20211220_192858.jpg","timestamp":1650403085720}],"reminders":[]},"b8ce3355-ac89-423c-924a-98dfb4fc6472":{"uuid":"b8ce3355-ac89-423c-924a-98dfb4fc6472","name":"Tall Plants","description":"","lightLevelKey":"INDIRECT_SUN","wateringKey":"NORMAL","temperatureRange":[12,25],"images":[{"key":"31ae6d9d-60f4-46cb-bddc-7fd2810d7e7d/images/f17e6427-0bf2-42ec-961f-f275fb3a98fb_IMG_20220227_213949.jpg","timestamp":1650403102307}],"reminders":[]},"307529b3-c4c2-4906-a11c-f6fa901627d4":{"uuid":"307529b3-c4c2-4906-a11c-f6fa901627d4","name":"Succulents","description":"","lightLevelKey":"SHADE","wateringKey":"NORMAL","temperatureRange":[16,26],"images":[{"key":"31ae6d9d-60f4-46cb-bddc-7fd2810d7e7d/images/adb9a494-5d6a-4e04-860d-0a6f3624a2c9_IMG_20220227_213939.jpg","timestamp":1650403120343}],"reminders":[]}}}')

export const plantsEmptyState: IPlantsState = {
  cards: [],
  plants: {}
}

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
