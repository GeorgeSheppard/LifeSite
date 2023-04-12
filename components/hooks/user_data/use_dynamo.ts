import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { mealPlanEmptyState } from "../../../store/reducers/food/meal_plan/meal_plan";
import { useAppSession } from "../use_app_session";
import { WithDefined } from "../../utilities/types";
import { IRecipe, RecipeUuid } from "../../../store/reducers/food/recipes/types";
import { getAllModelsForAUser, getAllRecipesForAUser, getMealPlanForAUser, getModel, getRecipe } from "../../aws/dynamo/dynamo_utilities";
import { IModelProps, ModelUuid } from "../../../store/reducers/printing/types";
import { IMealPlan } from "../../../store/reducers/food/meal_plan/types";
import { NewRecipe } from "../../../pages/food/[recipeUuid]";
import clone from "just-clone";
import { mealPlanQueryKey, modelQueryKey, modelsQueryKey, recipeQueryKey, recipesQueryKey, shared } from "./query_keys";


export const useRecipes = () => {
  const { id, loading } = useAppSession();
  const queryClient = useQueryClient();

  const userId = id ?? shared;
  const queryKey = recipesQueryKey(userId);

  const recipes = useQuery({
    queryKey,
    queryFn: () => getAllRecipesForAUser(userId),
    placeholderData: [],
    enabled: !loading
  });

  // We fetch all recipes for a user together, but we want to make sure that if a recipe
  // is individually queried that it uses the cached result
  recipes.data?.forEach((recipe: IRecipe) =>
    queryClient.setQueryData(recipeQueryKey(recipe.uuid, userId), recipe)
  );

  return recipes;
};

export const useRecipe = (recipeId: RecipeUuid) => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;

  const recipes = useQuery({
    queryKey: recipeQueryKey(recipeId, userId),
    queryFn: () => getRecipe(recipeId, userId),
    enabled: !loading && !!recipeId && recipeId !== NewRecipe
  });

  return recipes;
}

export const usePrinting = (): WithDefined<UseQueryResult<IModelProps[]>, "data"> => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;
  const queryClient = useQueryClient();
  const queryKey = modelsQueryKey(userId);

  const models = useQuery({
    queryKey,
    queryFn: () => getAllModelsForAUser(userId),
    placeholderData: [],
    enabled: !loading
  });

  // We fetch all models for a user together, but we want to make sure that if a model
  // is individually queried that it uses the cached result
  models.data?.forEach((model: IModelProps) =>
    queryClient.setQueryData(modelQueryKey(model.uuid, userId), model)
  );

  return {
    ...models,
    data: models.data!
  };
};

export const usePrint = (modelId: ModelUuid) => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;

  const recipes = useQuery({
    queryKey: modelQueryKey(modelId, userId),
    queryFn: () => getModel(modelId, userId),
    enabled: !loading && !!modelId
  });

  return recipes;
}

export const useMealPlan = (): WithDefined<UseQueryResult<IMealPlan>, "data"> => {
  const { id, loading } = useAppSession();
  const userId = id ?? shared;

  const recipes = useQuery({
    queryKey: mealPlanQueryKey(userId),
    queryFn: () => getMealPlanForAUser(userId),
    enabled: !loading,
    placeholderData: mealPlanEmptyState,
    select: (mealPlan: IMealPlan) => {
      let newDatesMealPlan = clone(mealPlanEmptyState);

      for (const [date, plan] of Object.entries(mealPlan)) {
        if (date in newDatesMealPlan) {
          newDatesMealPlan[date] = plan;
        }
      }
      return newDatesMealPlan
    }
  });

  return {
    ...recipes,
    data: recipes.data!
  };
}