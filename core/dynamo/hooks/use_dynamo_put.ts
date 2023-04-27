import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { IRecipe } from "../../../core/types/recipes";
import {
  mealPlanQueryKey,
  recipeQueryKey,
  recipesQueryKey,
  shared,
} from "../../../core/dynamo/query_keys";
import {
  IAddOrUpdatePlan,
  addOrUpdatePlan,
} from "../../meal_plan/meal_plan_utilities";
import { useMealPlan } from "./use_dynamo_get";
import { IMealPlan } from "../../types/meal_plan";
import { useAppSession } from "../../hooks/use_app_session";
import { putMealPlanForUser, putRecipe } from "../dynamo_utilities";

export interface IRecipeCacheContext {
  rQueryKey: string[];
  previousRecipeValue: IRecipe | undefined;
  rsQueryKey: string[];
  previousRecipesValue: IRecipe[] | undefined;
}

const useMutateRecipeInCache = () => {
  const queryClient = useQueryClient();

  return {
    mutate: (recipe: IRecipe, userId: string) => {
      const rQueryKey = recipeQueryKey(recipe.uuid, userId);
      const rsQueryKey = recipesQueryKey(userId);

      const previousRecipeValue: IRecipe | undefined =
        queryClient.getQueryData(rQueryKey);
      queryClient.setQueryData(rQueryKey, () => recipe);

      const previousRecipesValue: IRecipe[] | undefined =
        queryClient.getQueryData(rsQueryKey);

      if (previousRecipesValue) {
        queryClient.setQueryData(rsQueryKey, () => {
          const recipeIndex = previousRecipesValue.findIndex(
            (rec) => rec.uuid === recipe.uuid
          );
          if (recipeIndex === -1) {
            return [recipe, ...previousRecipesValue];
          } else {
            previousRecipesValue[recipeIndex] = recipe;
            return previousRecipesValue;
          }
        });
      }

      return {
        rQueryKey,
        previousRecipeValue,
        rsQueryKey,
        previousRecipesValue,
      };
    },
    reset: (context: IRecipeCacheContext) => {
      const {
        rQueryKey,
        previousRecipeValue,
        rsQueryKey,
        previousRecipesValue,
      } = context;
      queryClient.setQueryData(rQueryKey, previousRecipeValue);
      queryClient.setQueryData(rsQueryKey, previousRecipesValue);
    },
  };
};

interface IMealPlanCacheContext {
  mQueryKey: QueryKey;
  previousMealPlan: IMealPlan | undefined;
}

const useMutateMealPlanInCache = () => {
  const queryClient = useQueryClient();
  const mealPlan = useMealPlan();

  return {
    mutate: (update: IAddOrUpdatePlan, userId: string) => {
      const mQueryKey = mealPlanQueryKey(userId);
      // Meal plan is always defined because we use initial data
      const previousMealPlan: IMealPlan = mealPlan.data;
      queryClient.setQueryData(mQueryKey, () =>
        addOrUpdatePlan(previousMealPlan, update)
      );

      return { mQueryKey, previousMealPlan };
    },
    reset: (context: IMealPlanCacheContext) => {
      queryClient.setQueryData(context.mQueryKey, context.previousMealPlan);
    },
  };
};

type SharedUpload = any;
// When a user is not logged in and is just trying the website, they read from a shared account on dynamo
// DB. When they make put operations we don't actually make modifications to the database but instead just
// update the query client cache. This means it is all wiped when they refresh without making changes to the database.
export const sharedUpload: SharedUpload = [];

export const usePutRecipeToDynamo = () => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;
  const { mutate, reset } = useMutateRecipeInCache();

  return {
    ...useMutation(
      (recipe: IRecipe) => {
        if (loading) {
          throw new Error("User loading");
        }
        if (userId === shared) {
          return Promise.resolve(sharedUpload);
        }
        return putRecipe(recipe, userId);
      },
      {
        onMutate: (recipe) => mutate(recipe, userId),
        onError: (_, __, context) => context && reset(context as any),
      }
    ),
    disabled: loading,
  };
};

export const usePutMealPlanToDynamo = () => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;
  const { mutate, reset } = useMutateMealPlanInCache();
  const mealPlan = useMealPlan();

  return {
    ...useMutation(
      (update: IAddOrUpdatePlan) => {
        if (loading) {
          throw new Error("User loading");
        }
        const currentMealPlan: IMealPlan | undefined = mealPlan.data
        if (!currentMealPlan) {
          throw new Error("No current meal plan");
        }
        if (userId === shared) {
          return Promise.resolve(sharedUpload);
        }

        return putMealPlanForUser(
          addOrUpdatePlan(currentMealPlan, update),
          userId
        );
      },
      {
        onMutate: (update: IAddOrUpdatePlan) => mutate(update, userId),
        onError: (_, __, context) => context && reset(context as any),
      }
    ),
    disabled: loading,
  };
};
