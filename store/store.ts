import { configureStore } from "@reduxjs/toolkit";
import printing from "./reducers/printing/printing";
import plants, { plantsInitialState } from "./reducers/plants/plants";
import food, { recipesInitialState } from "./reducers/food/recipes/recipes";
import mealPlan from "./reducers/food/meal_plan/meal_plan";
import user, { userInitialState } from "./reducers/user/user";
import { IRecipesState } from "./reducers/food/recipes/types";
import { IPlantsState } from "./reducers/plants/types";
import { IPrintingState } from "./reducers/printing/types";
import { IMealPlanState } from "./reducers/food/meal_plan/types";
import { IUserState } from "./reducers/user/types";
import { isPrintingValid } from "./reducers/printing/schema";
import { isPlantsValid } from "./reducers/plants/schema";
import { isRecipesValid } from "./reducers/food/recipes/schema";
import { isMealPlanValid } from "./reducers/food/meal_plan/schema";
import { isUserValid } from "./reducers/user/schema";
import { mealPlanInitialState } from "./reducers/food/meal_plan/meal_plan";
import { printingInitialState } from "./reducers/printing/printing";

export interface IFullStoreState {
  printing: IPrintingState;
  plants: IPlantsState;
  food: IRecipesState;
  mealPlan: IMealPlanState;
  user: IUserState;
}

export type MutateFunc<T> = (
  store: IFullStoreState,
  payload: T
) => IFullStoreState;

export const store = configureStore<IFullStoreState>({
  reducer: {
    printing,
    plants,
    food,
    mealPlan,
    user,
  },
});

export const initialState: IFullStoreState = {
  food: recipesInitialState,
  mealPlan: mealPlanInitialState,
  plants: plantsInitialState,
  printing: printingInitialState,
  user: userInitialState,
};

export const isStoreValid = (state: IFullStoreState) => {
  return (
    isPrintingValid(state.printing) &&
    isPlantsValid(state.plants) &&
    isRecipesValid(state.food) &&
    isMealPlanValid(state.mealPlan) &&
    isUserValid(state.user)
  );
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
