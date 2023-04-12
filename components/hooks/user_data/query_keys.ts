import { RecipeUuid } from "../../../store/reducers/food/recipes/types";
import { ModelUuid } from "../../../store/reducers/printing/types";

export const shared = "shared"

export const sessionQueryKey = (userId: string) => [userId];
export const recipesQueryKey = (userId: string) => [userId, "R-"];
export const recipeQueryKey = (id: RecipeUuid, userId: string) => [
  userId,
  "R-",
  id,
];
export const modelsQueryKey = (userId: string) => [userId, "M-"];
export const modelQueryKey = (id: ModelUuid, userId: string) => [
  userId,
  "M-",
  id,
];
export const mealPlanQueryKey = (userId: string) => [userId, "MP"];
