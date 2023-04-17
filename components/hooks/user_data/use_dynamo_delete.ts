import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSession } from "../use_app_session";
import { deleteFromDynamo } from "../../aws/dynamo/dynamo_utilities";
import {
  mealPlanQueryKey,
  recipeQueryKey,
  recipesQueryKey,
  shared,
} from "./query_keys";
import {
  IRecipe,
  RecipeUuid,
} from "../../../store/reducers/food/recipes/types";
import { IRecipeCacheContext, sharedUpload } from "./use_dynamo_put";
import { IMealPlan } from "../../../store/reducers/food/meal_plan/types";
import clone from "just-clone";

const useDeleteRecipeInCache = () => {
  const queryClient = useQueryClient();

  return {
    mutate: (recipeId: RecipeUuid, userId: string) => {
      const rQueryKey = recipeQueryKey(recipeId, userId);
      const rsQueryKey = recipesQueryKey(userId);

      const previousRecipeValue: IRecipe | undefined =
        queryClient.getQueryData(rQueryKey);
      queryClient.removeQueries({ queryKey: rQueryKey });
      const previousRecipesValue: IRecipe[] | undefined =
        queryClient.getQueryData(rsQueryKey);

      if (previousRecipesValue) {
        queryClient.setQueryData(rsQueryKey, () =>
          previousRecipesValue.filter((rec) => rec.uuid !== recipeId)
        );
      }

      const mQueryKey = mealPlanQueryKey(userId);
      const previousMealPlan: IMealPlan | undefined =
        queryClient.getQueryData(mQueryKey);
      if (previousMealPlan) {
        const newMealPlan = clone(previousMealPlan);
        for (const date of Object.keys(newMealPlan)) {
          const dailyPlan = newMealPlan[date];
          delete dailyPlan[recipeId];
        }
        queryClient.setQueryData(mQueryKey, () => newMealPlan);
      }

      return {
        rQueryKey,
        previousRecipeValue,
        rsQueryKey,
        previousRecipesValue,
        mQueryKey,
        previousMealPlan,
      };
    },
    reset: (
      context: IRecipeCacheContext & {
        mQueryKey: QueryKey;
        previousMealPlan: IMealPlan | undefined;
      }
    ) => {
      const {
        rQueryKey,
        previousRecipeValue,
        rsQueryKey,
        previousRecipesValue,
        mQueryKey,
        previousMealPlan,
      } = context;
      queryClient.setQueryData(rQueryKey, previousRecipeValue);
      queryClient.setQueryData(rsQueryKey, previousRecipesValue);
      queryClient.setQueryData(mQueryKey, previousMealPlan);
    },
  };
};

export const useDeleteRecipeFromDynamo = () => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;
  const { mutate, reset } = useDeleteRecipeInCache();

  return {
    ...useMutation(
      (recipeId: RecipeUuid) => {
        if (loading) {
          throw new Error("User loading");
        }
        if (userId === shared) {
          return Promise.resolve(sharedUpload);
        }
        return deleteFromDynamo({ type: "R-", id: recipeId }, userId);
      },
      {
        onMutate: (recipeId) => mutate(recipeId, userId),
        onError: (_, __, context) => context && reset(context),
      }
    ),
    disabled: loading,
  };
};
