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
} from "./query_keys";
import {
  IRecipe,
  RecipeUuid,
} from "../../../store/reducers/food/recipes/types";

export const useDeleteModelFromDynamo = () => {
  const session = useAppSession();
  const queryClient = useQueryClient();

  return useMutation(
    (id: ModelUuid) => deleteFromDynamo({ type: "M-", id }, session.id ?? ""),
    {
      onSuccess: (data: DeleteCommandOutput, id: ModelUuid) => {
        const mQueryKey = modelQueryKey(session, id);
        const msQueryKey = modelsQueryKey(session);

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
  );
};

export const useDeleteRecipeFromDynamo = () => {
  const session = useAppSession();
  const queryClient = useQueryClient();

  return useMutation(
    (id: RecipeUuid) => deleteFromDynamo({ type: "R-", id }, session.id ?? ""),
    {
      onSuccess: (data: DeleteCommandOutput, id: RecipeUuid) => {
        const rQueryKey = recipeQueryKey(session, id);
        const rsQueryKey = recipesQueryKey(session);

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
  );
};
