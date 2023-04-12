import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSession } from "../use_app_session";
import { IRecipe } from "../../../store/reducers/food/recipes/types";
import { putMealPlanForUser, putModel, putRecipe } from "../../aws/dynamo/dynamo_utilities";
import { PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { mealPlanQueryKey, modelQueryKey, modelsQueryKey, recipeQueryKey, recipesQueryKey } from "./query_keys";
import { IModelProps } from "../../../store/reducers/printing/types";
import { IMealPlan } from "../../../store/reducers/food/meal_plan/types";
import { IAddOrUpdatePlan, addOrUpdatePlan } from "../../../store/reducers/food/meal_plan/meal_plan";


export const usePutRecipeToDynamo = () => {
  const session = useAppSession();
  const queryClient = useQueryClient();
  
  return useMutation((recipe: IRecipe) => putRecipe(recipe, session?.id), {
    onSuccess: (data: PutCommandOutput, recipe: IRecipe) => {
      const rQueryKey = recipeQueryKey(session, recipe.uuid);
      const rsQueryKey = recipesQueryKey(session);

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
  });
};

export const usePutModelToDynamo = () => {
  const session = useAppSession();
  const queryClient = useQueryClient();
  
  return useMutation((model: IModelProps) => putModel(model, session?.id), {
    onSuccess: (data: PutCommandOutput, model: IModelProps) => {
      const mQueryKey = modelQueryKey(session, model.uuid);
      const msQueryKey = modelsQueryKey(session);
      
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
    });
  };
  
  export const usePutMealPlanToDynamo = () => {
    const session = useAppSession();
    const queryClient = useQueryClient();
    
    return useMutation((update: IAddOrUpdatePlan) => {
      const currentMealPlan: IMealPlan | undefined = queryClient.getQueryData(mealPlanQueryKey(session));
      if (!currentMealPlan) {
        throw new Error('No current meal plan');
      }
      
      return putMealPlanForUser(addOrUpdatePlan(currentMealPlan, update), session?.id)
    }, {
      onSuccess: (_: PutCommandOutput, update: IAddOrUpdatePlan) => {
        const mQueryKey = mealPlanQueryKey(session);
        queryClient.setQueryData(mQueryKey, () => addOrUpdatePlan(queryClient.getQueryData(mQueryKey)!, update));
      }
    })
}
  
