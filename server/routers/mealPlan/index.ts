import { z } from "zod";
import { router, withUser } from "../../trpc";
import { updateMealPlan } from "./mutations";
import { getMealPlan } from "./queries";
import { mealPlanValidator } from "./validators/mealPlan";

export const mealPlanRouter = router({
  getMealPlan: withUser.query(({ ctx }) => getMealPlan(ctx.session.id)),
  updateMealPlan: withUser
    .input(z.object({ mealPlan: mealPlanValidator }))
    .mutation(({ ctx, input }) =>
      updateMealPlan(ctx.session.id, input.mealPlan)
  ),
});
