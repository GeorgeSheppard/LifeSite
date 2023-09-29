import { recipesRouter } from "./routers/recipes";
import { publicProcedure, router } from './trpc';

export const appRouter = router({
  testData: publicProcedure.query(() => ({ test: 'data' })),
  recipes: recipesRouter
});

export type AppRouter = typeof appRouter;