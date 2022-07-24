import { JSONSchemaType } from "ajv";
import { Image } from "./types";

export const imageSchema: JSONSchemaType<Image> = {
  type: "object",
  properties: {
    timestamp: { type: "number" },
    key: { type: "string" },
  },
  required: ["timestamp", "key"],
};
