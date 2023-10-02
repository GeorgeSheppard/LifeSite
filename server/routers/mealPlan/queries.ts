import clone from "just-clone";
import { getMealPlanForAUser } from "../../../core/dynamo/dynamo_utilities";
import { IMealPlan } from "../../../core/types/meal_plan";
import { mealPlanEmptyState } from "../../../core/meal_plan/meal_plan_utilities";
import { UserId } from "../../../core/types/utilities";

const mealPlanWithUpdatedDates = (mealPlan: IMealPlan): IMealPlan => {
  let newDatesMealPlan = clone(mealPlanEmptyState);

  for (const [date, plan] of Object.entries(mealPlan)) {
    if (date in newDatesMealPlan) {
      newDatesMealPlan[date] = plan;
    }
  }
  return newDatesMealPlan;
}

export const getMealPlan = async (userId: UserId): Promise<IMealPlan> => {
  try {
    const existingMealPlan = await getMealPlanForAUser(userId)
    const updatedMealPlan = mealPlanWithUpdatedDates(existingMealPlan)
    return updatedMealPlan
  } catch (e) {
    console.error(`Error getMealPlan: ${e}`)
    throw e
  }
}