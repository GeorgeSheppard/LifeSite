import { IVersion } from "../../../migration/types";
import { RecipeUuid } from "../recipes/types";

export type DateString = string;

export interface IMealPlanState {
  version: IVersion;
  plan: { [index: DateString]: IDailyMealPlan };
}

export type IDailyMealPlan = IMealPlanItem[];

export interface IMealPlanItem {
  uuid: RecipeUuid;
  servings: number;
}
