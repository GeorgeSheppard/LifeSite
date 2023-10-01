import {
  getAllRecipesForAUser,
  getRecipe,
} from "../../../core/dynamo/dynamo_utilities";
import { IRecipe, IRecipes, RecipeUuid } from "../../../core/types/recipes";
import { UserId } from "../../../pages/api/auth/[...nextauth]";

export const getRecipeForUser = async ({
  user,
  recipeId,
}: {
  user: UserId;
  recipeId: RecipeUuid;
}): Promise<IRecipe> => {
  const recipe = await getRecipe(recipeId, user);
  return recipe;
};

export const getRecipesForUser = async ({
  user,
}: {
  user: UserId;
}): Promise<IRecipes> => {
  const recipes = await getAllRecipesForAUser(user);
  return recipes.reduce((prev, curr) => prev.set(curr.uuid, curr), new Map());
};
