import { IVersion } from "../../../migration/types";
import { ComponentUuid, RecipeUuid } from "../recipes/types";

export type DateString = string;

export type IMealPlan = { [index: DateString]: IDailyMealPlan }

export interface IMealPlanState {
  version: IVersion;
  plan: IMealPlan;
}

export interface IDailyMealPlan {
  [index: RecipeUuid]: IComponentItem[];
}

export interface IComponentItem {
  componentId: ComponentUuid;
  servings: number;
}
