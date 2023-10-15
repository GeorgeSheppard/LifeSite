import "../core/dynamo/dynamo_client";
import "../core/s3/s3_client";
import { mealPlanRouter } from "./routers/mealPlan";
import { recipesRouter } from "./routers/recipes";
import { s3Router } from "./routers/s3";
import { router } from './trpc';

export const appRouter = router({
  recipes: recipesRouter,
  mealPlan: mealPlanRouter,
  s3: s3Router
});

export type AppRouter = typeof appRouter;