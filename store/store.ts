import { configureStore } from "@reduxjs/toolkit";
import printing from "./reducers/printing/printing";
import plants from "./reducers/plants/plants";
import food from "./reducers/food/recipes/recipes";
import mealPlan from "./reducers/food/meal_plan/meal_plan";
import user from "./reducers/user/user";
import { IRecipesState } from "./reducers/food/recipes/types";
import { IPlantsState } from "./reducers/plants/types";
import { IPrintingState } from "./reducers/printing/types";
import { IMealPlanState } from "./reducers/food/meal_plan/types";
import { IUserState } from "./reducers/user/types";

export interface IFullStoreState {
  printing: IPrintingState;
  plants: IPlantsState;
  food: IRecipesState;
  mealPlan: IMealPlanState;
  user: IUserState;
}

export const store = configureStore<IFullStoreState>({
  reducer: {
    printing,
    plants,
    food,
    mealPlan,
    user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
