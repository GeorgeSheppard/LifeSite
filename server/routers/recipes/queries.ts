import {
  getAllRecipesForAUser,
  getSharedRecipe as getSharedRecipeFromDynamo
} from "../../../core/dynamo/dynamo_utilities";
import { IRecipe, IRecipes } from "../../../core/types/recipes";
import { UserId } from "../../../core/types/utilities";
import { SharedRecipeId } from '../../../core/dynamo/dynamo_utilities';

export const getRecipesForUser = async ({
  user,
}: {
  user: UserId;
  }): Promise<IRecipes> => {
  try {
    const recipes = await getAllRecipesForAUser(user);
    return recipes.reduce((prev, curr) => prev.set(curr.uuid, curr), new Map());
  } catch (e) {
    console.error(`Error getRecipesForUser: ${e}`)
    throw e
  }
};

export const getSharedRecipe = async({
  id
}: {
  id: SharedRecipeId
  }): Promise<IRecipe> => {
  const recipe = await getSharedRecipeFromDynamo(id)
  return recipe
}