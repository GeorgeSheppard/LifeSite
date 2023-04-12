import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSession } from "../use_app_session";
import { IModelProps, ModelUuid } from "../../../store/reducers/printing/types";
import { deleteFromDynamo } from "../../aws/dynamo/dynamo_utilities";
import { DeleteCommandOutput } from "@aws-sdk/lib-dynamodb";
import {
  modelQueryKey,
  modelsQueryKey,
  recipeQueryKey,
  recipesQueryKey,
  shared,
} from "./query_keys";
import {
  IRecipe,
  RecipeUuid,
} from "../../../store/reducers/food/recipes/types";

export const useDeleteModelFromDynamo = () => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;
  const queryClient = useQueryClient();

  return {
    ...useMutation(
      (modelId: ModelUuid) => {
        if (loading) {
          throw new Error("User loading");
        }
        return deleteFromDynamo({ type: "M-", id: modelId }, userId);
      },
      {
        onSuccess: (data: DeleteCommandOutput, modelId: ModelUuid) => {
          const mQueryKey = modelQueryKey(modelId, userId);
          const msQueryKey = modelsQueryKey(userId);

          queryClient.removeQueries({ queryKey: mQueryKey });
          const previousModelsValue: IModelProps[] | undefined =
            queryClient.getQueryData(msQueryKey);
          if (previousModelsValue) {
            queryClient.setQueryData(msQueryKey, () => {
              return previousModelsValue.filter((model) => model.uuid !== id);
            });
          }
        },
      }
    ),
    disabled: loading,
  };
};

export const useDeleteRecipeFromDynamo = () => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;
  const queryClient = useQueryClient();

  return {
    ...useMutation(
      (recipeId: RecipeUuid) => {
        if (loading) {
          throw new Error("User loading");
        }
        return deleteFromDynamo({ type: "R-", id: recipeId }, userId);
      },
      {
        onSuccess: (data: DeleteCommandOutput, recipeId: RecipeUuid) => {
          const rQueryKey = recipeQueryKey(recipeId, userId);
          const rsQueryKey = recipesQueryKey(userId);

          queryClient.removeQueries({ queryKey: rQueryKey });
          const previousRecipesValue: IRecipe[] | undefined =
            queryClient.getQueryData(rsQueryKey);
          if (previousRecipesValue) {
            queryClient.setQueryData(rsQueryKey, () => {
              return previousRecipesValue.filter((rec) => rec.uuid !== id);
            });
          }
        },
      }
    ),
    disabled: loading,
  };
};
