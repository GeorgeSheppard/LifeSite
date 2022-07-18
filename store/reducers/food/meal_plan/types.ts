import { IVersion } from "../../../migration/types";
import { RecipeUuid } from "../recipes/types";

export type DateString = string;

export interface IMealPlanState {
  version: IVersion;
  // typescript does not like this primitive alias
  // [index: DateString]: IDailyMealPlan
  plan: { [index: string]: IDailyMealPlan };
}

export type IDailyMealPlan = IMealPlanItem[];

export interface IMealPlanItem {
  uuid: RecipeUuid;
  servings: number;
}
