import { z } from "zod";
import { IComponentItem, IMealPlan } from "../../../../core/types/meal_plan";

const mealPlanComponentValidator: z.ZodType<IComponentItem> = z.object({
  componentId: z.string(),
  servings: z.number(),
});

export const mealPlanValidator: z.ZodType<IMealPlan> = z.record(
  z.record(mealPlanComponentValidator.array())
);
