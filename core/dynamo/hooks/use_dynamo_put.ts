import { IRecipe, IRecipes } from "../../../core/types/recipes";
import {
  IAddOrUpdatePlan,
  addOrUpdatePlan,
} from "../../meal_plan/meal_plan_utilities";
import { useMealPlan } from "./use_dynamo_get";
import { IMealPlan } from "../../types/meal_plan";
import { useAppSession } from "../../hooks/use_app_session";
import { trpc } from "../../../client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

const useMutateRecipeInCache = () => {
  const queryClient = useQueryClient();
  const recipesKey = getQueryKey(trpc.recipes.getRecipes, undefined, "query")

  return (recipe: IRecipe) => {
    const previousRecipes: IRecipes | undefined =
      queryClient.getQueryData(recipesKey);

    if (previousRecipes) {
      const updatedRecipes = new Map(previousRecipes);
      updatedRecipes.set(recipe.uuid, recipe);
      queryClient.setQueryData(recipesKey, updatedRecipes);
    }

    return {
      undo: () => queryClient.setQueryData(recipesKey, previousRecipes),
    };
  };
};

const useMutateMealPlanInCache = () => {
  const queryClient = useQueryClient();
  const mealPlanKey = getQueryKey(trpc.mealPlan.getMealPlan, undefined, "query")

  return (newMealPlan: IMealPlan) => {
    const previousMealPlan: IMealPlan | undefined =
      queryClient.getQueryData(mealPlanKey);

    queryClient.setQueryData(mealPlanKey, newMealPlan);

    return {
      undo: () => queryClient.setQueryData(mealPlanKey, previousMealPlan),
    };
  };
};

type SharedUpload = any;
// When a user is not logged in and is just trying the website, they read from a shared account on dynamo
// DB. When they make put operations we don't actually make modifications to the database but instead just
// update the query client cache. This means it is all wiped when they refresh without making changes to the database.
export const sharedUpload: SharedUpload = [];

export const usePutRecipeToDynamo = () => {
  const { loading } = useAppSession();
  const mutate = useMutateRecipeInCache();

  return {
    ...trpc.recipes.updateRecipe.useMutation({
      onMutate: ({ recipe }) => mutate(recipe),
      onError: (_, __, context) => context?.undo(),
    }),
    disabled: loading,
  };
};

export const usePutMealPlanToDynamo = () => {
  const { loading } = useAppSession();
  const mutate = useMutateMealPlanInCache();
  const mealPlan = useMealPlan();

  const updateMealPlan = trpc.mealPlan.updateMealPlan.useMutation({
    onMutate: ({ mealPlan: newMealPlan }) => mutate(newMealPlan),
    onError: (_, __, context) => context?.undo(),
  });

  return {
    ...updateMealPlan,
    mutate: (update: IAddOrUpdatePlan) => {
      updateMealPlan.mutate({
        mealPlan: addOrUpdatePlan(mealPlan.data, update),
      });
    },
    disabled: loading || mealPlan.isPlaceholderData,
  };
};
