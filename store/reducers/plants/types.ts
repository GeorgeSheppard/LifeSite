import { IVersion } from "../../migration/types";
import { Image } from "../types";

export interface Checkboxes {
  /**
   * Note: Icon is any, watering passes the imported component, sun is the react element
   */
  [key: string]: { tooltip: string; icon: any };
}

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

export enum WateringAmountKeys {
  LITTLE = "LITTLE",
  NORMAL = "NORMAL",
  LOTS = "LOTS",
}

// export type TemperatureRange = [low: number, high: number];
export type TemperatureRange = number[];

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

// Do not change the name, part of CI validation process
export default interface IPlantsState {
  version: IVersion;
  cards: PlantUuid[];
  // typescript does not like this primitive alias
  // [key: PlantUuid]: IPlant
  plants: { [key: string]: IPlant };
}
