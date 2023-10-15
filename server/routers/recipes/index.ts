import { z } from "zod";
import { publicProcedure, router, withUser } from "../../trpc";
import {
  getRecipeForUser,
  getRecipesForUser,
  getSharedRecipe,
} from "./queries";
import { deleteRecipe, shareRecipe, updateRecipe } from "./mutations";
import { recipeValidator } from "./validators/recipe";
import { v4 as uuidv4 } from "uuid";

export const recipesRouter = router({
  getExternalRecipe: publicProcedure
    .input(
      z.object({
        recipeId: z.string(),
        user: z.string(),
      })
    )
    .query(({ input }) => getRecipeForUser(input)),
  getRecipes: withUser.query(({ ctx }) =>
    getRecipesForUser({ user: ctx.session.id })
  ),
  deleteRecipe: withUser
    .input(z.object({ recipeId: z.string() }))
    .mutation(({ ctx, input: { recipeId } }) =>
      deleteRecipe(ctx.session.id, recipeId)
    ),
  updateRecipe: withUser
    .input(z.object({ recipe: recipeValidator }))
    .mutation(({ ctx, input: { recipe } }) =>
      updateRecipe(ctx.session.id, recipe)
    ),
  createSharedRecipe: publicProcedure
    .input(z.object({ recipe: recipeValidator }))
    .mutation(({ input: { recipe } }) => shareRecipe(uuidv4(), recipe)),
  getSharedRecipe: publicProcedure
    .input(z.object({ share: z.string() }))
    .query(({ input: { share } }) => getSharedRecipe({ id: share })),
});
