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
import { mealPlanQueryKey, modelQueryKey, modelsQueryKey, recipeQueryKey, recipesQueryKey } from "./query_keys";


export const useRecipes = () => {
  const session = useAppSession();
  const queryClient = useQueryClient();
  const queryKey = recipesQueryKey(session);

  const recipes = useQuery({
    queryKey,
    queryFn: () => getAllRecipesForAUser(session?.id),
    placeholderData: [],
    enabled: !!session?.id
  });

  // We fetch all recipes for a user together, but we want to make sure that if a recipe
  // is individually queried that it uses the cached result
  recipes.data?.forEach((recipe: IRecipe) =>
    queryClient.setQueryData(recipeQueryKey(session, recipe.uuid), recipe)
  );

  return recipes;
};

export const useRecipe = (id: RecipeUuid) => {
  const session = useAppSession();

  const recipes = useQuery({
    queryKey: recipeQueryKey(session, id),
    queryFn: () => getRecipe(id, session?.id),
    enabled: !!session?.id && !!id && id !== NewRecipe
  });

  return recipes;
}

export const usePrinting = (): WithDefined<UseQueryResult<IModelProps[]>, "data"> => {
  const session = useAppSession();
  const queryClient = useQueryClient();
  const queryKey = modelsQueryKey(session);

  const models = useQuery({
    queryKey,
    queryFn: () => getAllModelsForAUser(session?.id),
    placeholderData: [],
    enabled: !!session?.id
  });

  // We fetch all models for a user together, but we want to make sure that if a model
  // is individually queried that it uses the cached result
  models.data?.forEach((model: IModelProps) =>
    queryClient.setQueryData(modelQueryKey(session, model.uuid), model)
  );

  return {
    ...models,
    data: models.data!
  };
};

export const usePrint = (id: ModelUuid) => {
  const session = useAppSession();

  const recipes = useQuery({
    queryKey: modelQueryKey(session, id),
    queryFn: () => getModel(id, session?.id),
    enabled: !!session?.id && !!id
  });

  return recipes;
}

export const useMealPlan = (): WithDefined<UseQueryResult<IMealPlan>, "data"> => {
  const session = useAppSession();

  const recipes = useQuery({
    queryKey: mealPlanQueryKey(session),
    queryFn: () => getMealPlanForAUser(session?.id),
    enabled: !!session?.id,
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