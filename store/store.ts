import { configureStore } from "@reduxjs/toolkit";
import printing, { IPrintingState } from "./reducers/printing";
import user, { IUserState } from "./reducers/user";
import plants, { IPlantsState } from "./reducers/plants";
import food, { IRecipesState } from "./reducers/food/recipes";
import mealPlan, { IMealPlanState } from "./reducers/food/meal_plan";

export interface IFullStoreState {
  user: IUserState;
  printing: IPrintingState;
  plants: IPlantsState;
  food: IRecipesState;
  mealPlan: IMealPlanState;
}

// TODO: Write some checks to make sure defaultProfile and any profiles conform
// to the state schema, already had a hard to find bug from forgetting about this
// possibly make it a pre commit hook
export const store = configureStore({
  reducer: {
    printing,
    user,
    plants,
    food,
    mealPlan
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
