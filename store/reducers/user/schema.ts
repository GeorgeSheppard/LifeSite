import Ajv, { JSONSchemaType } from "ajv";
import { IUserState } from "./types";

const userStateSchema: JSONSchemaType<IUserState> = {
  type: "object",
  properties: {
    version: { type: "string" },
  },
  required: ["version"],
};

const ajv = new Ajv();
export const isUserValid = ajv.compile(userStateSchema);
