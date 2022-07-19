import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import clone from "just-clone";
import { Migrator } from "../../../migration/migrator";
import { IFullStoreState } from "../../../store";
import { RecipeUuid } from "../recipes/types";
import { latestVersion, migrations } from "./migrations";
import { isMealPlanValid } from "./schema";
import { DateString, IMealPlanState } from "./types";

export function addDays(theDate: Date, days: number) {
  return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}

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
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  });
}

export function currentDate(): Date {
  const time = new Date().setHours(12, 0, 0, 0);
  return new Date(time);
}

export const mealPlanEmptyState: IMealPlanState = {
  version: latestVersion,
  plan: createDates(currentDate(), 7, 14).reduce(
    (previous, current) => ({
      ...previous,
      [current]: [],
    }),
    {}
  ),
};

const initialState = mealPlanEmptyState;

const migrator = new Migrator<IMealPlanState>(
  migrations,
  latestVersion,
  isMealPlanValid
);

export const mealPlanSlice = createSlice({
  name: "mealPlanner",
  initialState,
  reducers: {
    addOrUpdatePlan: (
      state,
      action: PayloadAction<
        { date: DateString } & { uuid: RecipeUuid; servingsIncrease: number }
      >
    ) => {
      const { date, uuid, servingsIncrease } = action.payload;
      if (state.plan[date]) {
        const index = state.plan[date].findIndex((plan) => plan.uuid === uuid);
        if (index > -1) {
          const newServings =
            state.plan[date][index].servings + servingsIncrease;
          if (newServings <= 0) {
            state.plan[date].splice(index, 1);
          } else {
            state.plan[date][index] = {
              uuid,
              servings: newServings,
            };
          }
        } else {
          state.plan[date].push({
            uuid,
            servings: 1,
          });
        }
      }
    },
    removeFromPlan: (
      state,
      action: PayloadAction<{ date: DateString } & { uuid: RecipeUuid }>
    ) => {
      const { date, uuid } = action.payload;
      const newPlan = clone(state.plan);

      if (!newPlan[date]) {
        return state;
      }

      const index = newPlan[date].findIndex((plan) => plan.uuid === uuid);
      if (index > -1) {
        newPlan[date].splice(index, 1);
      }

      return { ...state, plan: newPlan };
    },
  },
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
          if (date in mealPlan) {
            mealPlan.plan[date] = plan;
          }
        }
      }

      return mealPlan;
    },
    "user/logout": (state) => {
      return initialState;
    },
  },
});

export const { addOrUpdatePlan, removeFromPlan } = mealPlanSlice.actions;

export default mealPlanSlice.reducer;
