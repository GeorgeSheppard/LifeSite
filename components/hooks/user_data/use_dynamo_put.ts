import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSession } from "../use_app_session";
import { IRecipe } from "../../../store/reducers/food/recipes/types";
import {
  putMealPlanForUser,
  putRecipe,
} from "../../aws/dynamo/dynamo_utilities";
import {
  mealPlanQueryKey,
  recipeQueryKey,
  recipesQueryKey,
  shared,
} from "./query_keys";
import { IMealPlan } from "../../../store/reducers/food/meal_plan/types";
import {
  IAddOrUpdatePlan,
  addOrUpdatePlan,
} from "../../../store/reducers/food/meal_plan/meal_plan";

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

  return {
    mutate: (update: IAddOrUpdatePlan, userId: string) => {
      const mQueryKey = mealPlanQueryKey(userId);
      // Meal plan is always defined because we use initial data
      const previousMealPlan: IMealPlan = queryClient.getQueryData(mQueryKey)!;
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
  const queryClient = useQueryClient();
  const { mutate, reset } = useMutateMealPlanInCache();

  return {
    ...useMutation(
      (update: IAddOrUpdatePlan) => {
        if (loading) {
          throw new Error("User loading");
        }
        const currentMealPlan: IMealPlan | undefined = queryClient.getQueryData(
          mealPlanQueryKey(userId)
        );
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
