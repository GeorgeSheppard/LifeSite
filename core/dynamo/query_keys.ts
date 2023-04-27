import { RecipeUuid } from "../types/recipes";

export const shared = "shared";

export const recipesQueryKey = (userId: string) => [userId, "R-"];
export const recipeQueryKey = (id: RecipeUuid, userId: string) => [
  userId,
  "R-",
  id,
];
export const mealPlanQueryKey = (userId: string) => [userId, "MP"];
