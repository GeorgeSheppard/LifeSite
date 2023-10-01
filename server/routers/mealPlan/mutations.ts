import { isSharedUser, putMealPlanForUser } from "../../../core/dynamo/dynamo_utilities";
import { sharedUpload } from "../../../core/dynamo/hooks/use_dynamo_put";
import { IMealPlan } from "../../../core/types/meal_plan";
import { UserId } from "../../../pages/api/auth/[...nextauth]";

export const updateMealPlan = async (user: UserId, mealPlan: IMealPlan) => {
  if (isSharedUser(user)) return Promise.resolve(sharedUpload)

  return await putMealPlanForUser(mealPlan, user)
}

// export const createShoppingList = async (user: UserId, mealPlan: IMealPlan): Promise<IQuantitiesAndMeals> => {
  
// }