import Ajv, { JSONSchemaType } from "ajv";
import { imageSchema } from "../schema";
import {
  IPlant,
  IReminder,
  LightLevelKeys,
  WateringAmountKeys,
  TemperatureRange,
  IPlantsState,
} from "./types";

const reminderSchema: JSONSchemaType<IReminder> = {
  type: "object",
  properties: {
    startTimestamp: { type: "number" },
    periodHours: { type: "number" },
    title: { type: "string" },
    description: { type: "string", nullable: true },
    icon: { type: "string" },
  },
  required: ["startTimestamp", "periodHours", "title", "icon"],
};

const lightLevelKeySchema: JSONSchemaType<LightLevelKeys> = {
  type: "string",
  enum: ["INDIRECT_SUN", "SHADE", "DIRECT_SUN"],
};

const wateringAmountKeySchema: JSONSchemaType<WateringAmountKeys> = {
  type: "string",
  enum: ["LITTLE", "NORMAL", "LOTS"],
};

const temperatureRangeSchema: JSONSchemaType<TemperatureRange> = {
  type: "array",
  items: { type: "number" },
  maxItems: 2,
  minItems: 2,
};

const plantSchema: JSONSchemaType<IPlant> = {
  type: "object",
  properties: {
    uuid: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    lightLevelKey: lightLevelKeySchema,
    wateringKey: wateringAmountKeySchema,
    temperatureRange: temperatureRangeSchema,
    images: {
      type: "array",
      items: imageSchema,
    },
    reminders: {
      type: "array",
      items: reminderSchema,
    },
  },
  required: [
    "uuid",
    "name",
    "description",
    "lightLevelKey",
    "wateringKey",
    "temperatureRange",
    "images",
    "reminders",
  ],
};

const plantsStateSchema: JSONSchemaType<IPlantsState> = {
  type: "object",
  properties: {
    version: { type: "string" },
    cards: { type: "array", items: { type: "string" } },
    plants: {
      type: "object",
      patternProperties: {
        ".*": plantSchema,
      },
      required: [],
    },
  },
  required: ["version", "cards", "plants"],
};

const ajv = new Ajv();
export const isPlantsValid = ajv.compile(plantsStateSchema);
