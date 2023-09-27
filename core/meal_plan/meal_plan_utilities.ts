import clone from "just-clone";
import { ComponentUuid, RecipeUuid } from "../types/recipes";
import { DateString, IMealPlan } from "../types/meal_plan";

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

export const dateToDateString = (date: Date): DateString =>
  `${weekdays[date.getDay()]} - ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

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
    return dateToDateString(date);
  });
}

export function currentDate(): Date {
  const time = new Date().setHours(12, 0, 0, 0);
  return new Date(time);
}

export const mealPlanEmptyState: IMealPlan = createDates(
  currentDate(),
  14,
  14
).reduce(
  (previous, current) => ({
    ...previous,
    [current]: {},
  }),
  {}
);

export interface IAddOrUpdatePlan {
  date: DateString;
  components: {
    recipeId: RecipeUuid;
    componentId: ComponentUuid;
    servingsIncrease: number;
  }[];
}

export const addOrUpdatePlan = (
  currentPlan: IMealPlan,
  payload: IAddOrUpdatePlan
): IMealPlan => {
  const mealPlan = clone(currentPlan);

  const { date, components } = payload;
  for (const { recipeId, componentId, servingsIncrease } of components) {
    if (mealPlan[date]) {
      if (recipeId in mealPlan[date]) {
        const componentIndex = mealPlan[date][recipeId].findIndex(
          (mealPlanItem) => mealPlanItem.componentId === componentId
        );
        if (componentIndex > -1) {
          const component = mealPlan[date][recipeId][componentIndex];
          const newServings = component.servings + servingsIncrease;
          // Note: We allow a component with zero servings, this allows the user to set that they are eating that
          // item in the meal plan, without having to buy ingredients for it, perhaps they have a portion in the freezer
          if (newServings >= 0) {
            mealPlan[date][recipeId][componentIndex].servings = newServings;
          } else {
            mealPlan[date][recipeId].splice(componentIndex, 1);
            if (mealPlan[date][recipeId].length === 0) {
              delete mealPlan[date][recipeId];
            }
          }
        } else {
          mealPlan[date][recipeId].push({
            componentId,
            servings: servingsIncrease,
          });
        }
      } else {
        mealPlan[date][recipeId] = [
          {
            componentId,
            servings: servingsIncrease,
          },
        ];
      }
    }
  }

  return mealPlan;
};
