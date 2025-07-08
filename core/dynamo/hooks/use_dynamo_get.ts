import { mealPlanEmptyState } from "../../meal_plan/meal_plan_utilities";
import { IRecipe, IRecipes, RecipeUuid } from "../../types/recipes";
import { NewRecipe } from "../../../lib/constants";
import { useAppSession } from "../../hooks/use_app_session";
import { trpc } from "../../../client";

const useRecipesBase = <T>({
  select,
  enabled,
}: {
  enabled?: boolean;
  select?: (data: IRecipes) => T;
}) => {
  const { loading } = useAppSession();
  return trpc.recipes.getRecipes.useQuery<Map<RecipeUuid, IRecipe>, T>(
    undefined,
    {
      enabled: !loading && (enabled ?? true),
      select,
    }
  );
};

export const useRecipes = () => {
  return useRecipesBase({
    select: (data) => Array.from(data.values()),
  });
};

export const useRecipeIds = () => {
  return useRecipesBase({
    select: (data) => Array.from(data.keys()),
  });
};

export const useRecipe = (recipeId?: RecipeUuid, enabled?: boolean) => {
  return useRecipesBase({
    select: (data) => {
      const recipe = data.get(recipeId!);
      return recipe;
    },
    enabled: enabled && !!recipeId && recipeId !== NewRecipe,
  });
};

export const useMealPlan = () => {
  const { loading } = useAppSession();
  const mealPlan = trpc.mealPlan.getMealPlan.useQuery(undefined, {
    enabled: !loading,
    placeholderData: mealPlanEmptyState,
  });
  return {
    ...mealPlan,
    data: mealPlan.data!,
  };
};
