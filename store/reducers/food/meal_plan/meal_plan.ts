import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import clone from "just-clone";
import { Migrator } from "../../../migration/migrator";
import { IFullStoreState, MutateFunc } from "../../../store";
import { ComponentUuid, RecipeUuid } from "../recipes/types";
import { latestVersion, migrations } from "./migrations";
import { isMealPlanValid } from "./schema";
import { DateString, IMealPlanState } from "./types";

export function addDays(theDate: Date, days: number) {
  return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function createDates(
  centreDate: Date,
  pastDays: number,
  futureDays: number
): DateString[] {
  const offsets = Array.from(Array(pastDays + futureDays).keys()).map(
    (val) => val - pastDays
  );

  return offsets.map((dayOffset) => {
    const date = addDays(centreDate, dayOffset);
    // getMonth has indices from 0
    return `${weekdays[date.getDay()]} - ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  });
}

export function currentDate(): Date {
  const time = new Date().setHours(12, 0, 0, 0);
  return new Date(time);
}

export const mealPlanEmptyState: IMealPlanState = {
  version: latestVersion,
  plan: createDates(currentDate(), 14, 14).reduce(
    (previous, current) => ({
      ...previous,
      [current]: {},
    }),
    {}
  ),
};

export const mealPlanInitialState = mealPlanEmptyState;

const migrator = new Migrator<IMealPlanState>(
  migrations,
  latestVersion,
  isMealPlanValid
);

export interface IAddOrUpdatePlan {
  date: DateString;
  components: {
    recipeId: RecipeUuid;
    componentId: ComponentUuid;
    servingsIncrease: number;
  }[];
}

export const addOrUpdatePlan: MutateFunc<IAddOrUpdatePlan> = (
  store: IFullStoreState,
  payload: IAddOrUpdatePlan
) => {
  const state = store.mealPlan;

  const { date, components } = payload;
  for (const { recipeId, componentId, servingsIncrease } of components) {
    if (state.plan[date]) {
      if (recipeId in state.plan[date]) {
        const componentIndex = state.plan[date][recipeId].findIndex(
          (mealPlanItem) => mealPlanItem.componentId === componentId
        );
        if (componentIndex > -1) {
          const component = state.plan[date][recipeId][componentIndex];
          const newServings = component.servings + servingsIncrease;
          // Note: We allow a component with zero servings, this allows the user to set that they are eating that
          // item in the meal plan, without having to buy ingredients for it, perhaps they have a portion in the freezer
          if (newServings >= 0) {
            state.plan[date][recipeId][componentIndex].servings = newServings;
          } else {
            state.plan[date][recipeId].splice(componentIndex, 1);
            if (state.plan[date][recipeId].length === 0) {
              delete state.plan[date][recipeId];
            }
          }
        } else {
          state.plan[date][recipeId].push({
            componentId,
            servings: servingsIncrease,
          });
        }
      } else {
        state.plan[date][recipeId] = [
          {
            componentId,
            servings: servingsIncrease,
          },
        ];
      }
    }
  }

  return store;
};

export const mealPlanSlice = createSlice({
  name: "mealPlanner",
  initialState: mealPlanInitialState,
  reducers: {},
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      if (!action.payload.mealPlan) {
        return state;
      }

      let migratedMealPlan: IMealPlanState = action.payload.mealPlan;
      if (migrator.needsMigrating(action.payload.mealPlan?.version)) {
        try {
          migratedMealPlan = migrator.migrate(action.payload.mealPlan);
        } catch (err) {
          console.error("An error occurrence migrating recipes: " + err);
          return state;
        }
      } else {
        if (!isMealPlanValid(migratedMealPlan)) {
          console.error(
            "Meal plan is invalid: " + JSON.stringify(action.payload.mealPlan)
          );
          return state;
        }
      }
      let mealPlan = clone(mealPlanEmptyState);

      if (migratedMealPlan.plan) {
        for (const [date, plan] of Object.entries(migratedMealPlan.plan)) {
          if (date in mealPlan.plan) {
            mealPlan.plan[date] = plan;
          }
        }
      }

      return mealPlan;
    },
  },
});

export default mealPlanSlice.reducer;
