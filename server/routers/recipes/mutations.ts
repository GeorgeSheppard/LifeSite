import { deleteFromDynamo, isSharedUser, putRecipe } from "../../../core/dynamo/dynamo_utilities";
import { sharedUpload } from "../../../core/dynamo/hooks/use_dynamo_put";
import { IRecipe, RecipeUuid } from "../../../core/types/recipes";
import { UserId } from "../../../pages/api/auth/[...nextauth]";

export const deleteRecipe = async (user: UserId, recipeId: RecipeUuid) => {
  if (isSharedUser(user)) return Promise.resolve(sharedUpload)

  return await deleteFromDynamo({ type: "R-", id: recipeId }, user)
}

export const updateRecipe = async (user: UserId, recipe: IRecipe) => {
  if (isSharedUser(user)) return Promise.resolve(sharedUpload)

  return await putRecipe(recipe, user)
} 