export type DateString = string;

export default interface IMealPlanState {
  plan: { [index: DateString]: IDailyMealPlan };
}

export type IDailyMealPlan = IMealPlanItem[];

export interface IMealPlanItem {
  uuid: RecipeUuid;
  servings: number;
}