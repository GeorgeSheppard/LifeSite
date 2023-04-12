import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSession } from "../use_app_session";
import { IRecipe } from "../../../store/reducers/food/recipes/types";
import {
  putMealPlanForUser,
  putModel,
  putRecipe,
} from "../../aws/dynamo/dynamo_utilities";
import { PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import {
  mealPlanQueryKey,
  modelQueryKey,
  modelsQueryKey,
  recipeQueryKey,
  recipesQueryKey,
  shared,
} from "./query_keys";
import { IModelProps } from "../../../store/reducers/printing/types";
import { IMealPlan } from "../../../store/reducers/food/meal_plan/types";
import {
  IAddOrUpdatePlan,
  addOrUpdatePlan,
} from "../../../store/reducers/food/meal_plan/meal_plan";

export const usePutRecipeToDynamo = () => {
  const { id, loading } = useAppSession();
  const queryClient = useQueryClient();
  const userId = id ?? shared;

  return {
    ...useMutation(
      (recipe: IRecipe) => {
        if (loading) {
          throw new Error("User loading");
        }
        return putRecipe(recipe, userId);
      },
      {
        onSuccess: (data: PutCommandOutput, recipe: IRecipe) => {
          const rQueryKey = recipeQueryKey(recipe.uuid, userId);
          const rsQueryKey = recipesQueryKey(userId);

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
        },
      }
    ),
    disabled: loading,
  };
};

export const usePutModelToDynamo = () => {
  const { id, loading } = useAppSession();
  const queryClient = useQueryClient();
  const userId = id ?? shared;

  return {
    ...useMutation(
      (model: IModelProps) => {
        if (loading) {
          throw new Error("User loading");
        }
        return putModel(model, userId);
      },
      {
        onSuccess: (data: PutCommandOutput, model: IModelProps) => {
          const mQueryKey = modelQueryKey(model.uuid, userId);
          const msQueryKey = modelsQueryKey(userId);

          queryClient.setQueryData(mQueryKey, () => model);

          const previousModelsValue: IModelProps[] | undefined =
            queryClient.getQueryData(msQueryKey);

          if (previousModelsValue) {
            queryClient.setQueryData(msQueryKey, () => {
              const modelIndex = previousModelsValue.findIndex(
                (rec) => rec.uuid === model.uuid
              );
              if (modelIndex === -1) {
                return [model, ...previousModelsValue];
              } else {
                previousModelsValue[modelIndex] = model;
                return previousModelsValue;
              }
            });
          }
        },
      }
    ),
    disabled: loading,
  };
};

export const usePutMealPlanToDynamo = () => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;
  const queryClient = useQueryClient();

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

        return putMealPlanForUser(
          addOrUpdatePlan(currentMealPlan, update),
          userId
        );
      },
      {
        onSuccess: (_: PutCommandOutput, update: IAddOrUpdatePlan) => {
          const mQueryKey = mealPlanQueryKey(userId);
          queryClient.setQueryData(mQueryKey, () =>
            addOrUpdatePlan(queryClient.getQueryData(mQueryKey)!, update)
          );
        },
      }
    ),
    disabled: loading,
  };
};
