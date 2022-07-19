import Ajv, { JSONSchemaType } from "ajv";
import { imageSchema } from "../schema";
import { ICameraParams, IModelProps, IPrintingState } from "./types";

const cameraParamsSchema: JSONSchemaType<ICameraParams> = {
  type: "object",
  properties: {
    zoom: { type: "number" },
    position: { type: "array", items: { type: "number" } },
    quaternion: { type: "array", items: { type: "number" } },
  },
  required: ["zoom", "position", "quaternion"],
};

const modelPropsSchema: JSONSchemaType<IModelProps> = {
  type: "object",
  properties: {
    filename: { type: "string" },
    description: { type: "string" },
    image: { ...imageSchema, nullable: true },
    key: { type: "string" },
    uuid: { type: "string" },
    cameraParams: { ...cameraParamsSchema, nullable: true },
  },
  required: ["filename", "description", "key", "uuid"],
};

const printingSchema: JSONSchemaType<IPrintingState> = {
  type: "object",
  properties: {
    version: { type: "string" },
    cards: { type: "array", items: { type: "string" } },
    models: {
      type: "object",
      patternProperties: {
        ".*": modelPropsSchema,
      },
      required: [],
    },
  },
  required: ["version", "cards", "models"],
};

const ajv = new Ajv();
export const isPrintingValid = ajv.compile(printingSchema);
