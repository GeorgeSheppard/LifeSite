import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import clone from "just-clone";
import { IFullStoreState } from "../../store";
import { RecipeUuid } from './recipes';

export type DateString = string;

export interface IMealPlanState {
  [index: DateString]: IDailyMealPlan;
}

export type IDailyMealPlan = IMealPlanItem[];

export interface IMealPlanItem {
  uuid: RecipeUuid;
  servings: number;
}

function addDays(theDate: Date, days: number) {
  return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}

function createDates(centreDate: Date, pastDays: number, futureDays: number): DateString[] {
  const offsets = Array.from(Array(pastDays + futureDays).keys()).map(val => val - pastDays)

  return offsets.map(dayOffset => {
    const date = addDays(centreDate, dayOffset)
    // getMonth has indices from 0
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  })
}

function currentDate(): Date {
  const time = (new Date()).setHours(12, 0, 0, 0);
  return new Date(time);
}

export const mealPlanEmptyState: IMealPlanState = createDates(currentDate(), 7, 14).reduce((previous, current) => ({
  ...previous, [current]: []
}), {})

const initialState: IMealPlanState = mealPlanEmptyState

export const mealPlanSlice = createSlice({
  name: "mealPlanner",
  initialState,
  reducers: {
    addOrUpdatePlan: (state, action: PayloadAction<{ date: DateString } & { uuid: RecipeUuid, servingsIncrease: number }>) => {
      const { date, uuid, servingsIncrease } = action.payload;
      if (!state[date]) {
        return state;
      }

      const index = state[date].findIndex(plan => plan.uuid === uuid)
      // Immer wasn't managing to figure out the mutations so sometimes the UI wasn't
      // updating, hence why I am using the immutable version of the reducer here
      const newState = clone(state)
      if (index > -1) {
        const newServings = newState[date][index].servings + servingsIncrease;
        if (newServings <= 0) {
          newState[date].splice(index, 1);
        } else {
          newState[date][index] = {
            uuid,
            servings: newServings
          };
        }
      } else {
        newState[date].push({
          uuid,
          servings: 1
        });
      }

      return newState;
    },
    removeFromPlan: (state, action: PayloadAction<{ date: DateString } & { uuid: RecipeUuid }>) => {
      const { date, uuid } = action.payload;
      if (state[date]) {
        const index = state[date].findIndex(plan => plan.uuid === uuid)
        if (index > -1) {
          state[date].splice(index, 1);
        }
      }
    }
  },
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      const mealPlan = createDates(currentDate(), 7, 14).reduce((previous, current) => ({
        ...previous, [current]: []
      }), mealPlanEmptyState)

      if (action.payload.mealPlan) {
        for (const [date, plan] of Object.entries(action.payload.mealPlan)) {
          if (date in mealPlan) {
            mealPlan[date] = plan;
          }
        }
      }

      return mealPlan;
    },
    "user/logout": (state) => {
      return initialState;
    },
  }
})

export const { addOrUpdatePlan, removeFromPlan } = mealPlanSlice.actions;

export default mealPlanSlice.reducer;