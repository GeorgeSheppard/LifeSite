import {
  recipesEmptyState,
  recipesInitialState,
} from "./reducers/food/recipes/recipes";
import { userEmptyState, userInitialState } from "./reducers/user/user";
import { IRecipesState } from "./reducers/food/recipes/types";
import { IPrintingState } from "./reducers/printing/types";
import { IMealPlanState } from "./reducers/food/meal_plan/types";
import { IUserState } from "./reducers/user/types";
import { isPrintingValid } from "./reducers/printing/schema";
import { isRecipesValid } from "./reducers/food/recipes/schema";
import { isMealPlanValid } from "./reducers/food/meal_plan/schema";
import { isUserValid } from "./reducers/user/schema";
import {
  mealPlanEmptyState,
  mealPlanInitialState,
} from "./reducers/food/meal_plan/meal_plan";
import {
  printingEmptyState,
  printingInitialState,
} from "./reducers/printing/printing";

export interface IFullStoreState {
  printing: IPrintingState;
  food: IRecipesState;
  mealPlan: IMealPlanState;
  user: IUserState;
}

export type MutateFunc<T> = (
  store: IFullStoreState,
  payload: T
) => IFullStoreState;

export const initialState: IFullStoreState = {
  food: recipesInitialState,
  mealPlan: mealPlanInitialState,
  printing: printingInitialState,
  user: userInitialState,
};

export const emptyStore: IFullStoreState = {
  food: recipesEmptyState,
  mealPlan: mealPlanEmptyState,
  printing: printingEmptyState,
  user: userEmptyState,
};

export const isStoreValid = (state: IFullStoreState) => {
  return (
    isPrintingValid(state.printing) &&
    isRecipesValid(state.food) &&
    isMealPlanValid(state.mealPlan) &&
    isUserValid(state.user)
  );
};
