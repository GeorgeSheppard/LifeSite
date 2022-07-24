import Ajv, { JSONSchemaType } from "ajv";
import { IComponentItem, IDailyMealPlan, IMealPlanState } from "./types";

const componentItemSchema: JSONSchemaType<IComponentItem> = {
  type: "object",
  properties: {
    componentId: { type: "string" },
    servings: { type: "number" },
  },
  required: ["componentId", "servings"],
};

const dailyMealPlanSchema: JSONSchemaType<IDailyMealPlan> = {
  type: "object",
  patternProperties: {
    ".*": { type: "array", items: componentItemSchema },
  },
  required: [],
};

const mealPlanStateSchema: JSONSchemaType<IMealPlanState> = {
  type: "object",
  properties: {
    version: { type: "string" },
    plan: {
      type: "object",
      patternProperties: {
        ".*": dailyMealPlanSchema,
      },
      required: [],
    },
  },
  required: ["version", "plan"],
};

const ajv = new Ajv();
export const isMealPlanValid = ajv.compile(mealPlanStateSchema);
