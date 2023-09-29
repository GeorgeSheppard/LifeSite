import { publicProcedure, router } from "../../trpc";

export const recipesRouter = router({
  getRecipes: publicProcedure.query(({ ctx }) => {
    console.log('context', ctx.session)
    return { another: 'test' }
  })
});