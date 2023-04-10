import { ListObjectsCommand } from "@aws-sdk/client-s3";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import clone from "just-clone";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { mealPlanEmptyState, migrateMealPlan } from "../../store/reducers/food/meal_plan/meal_plan";
import { migrateRecipes } from "../../store/reducers/food/recipes/recipes";
import { migratePrinting } from "../../store/reducers/printing/printing";
import { migrateUser } from "../../store/reducers/user/user";
import { emptyStore, IFullStoreState, initialState } from "../../store/store";
import { AwsS3Client } from "../aws/s3_client";
import { getS3SignedUrl } from "../aws/s3_utilities";
import { useAppSession } from "./use_app_session";
import { WithDefined } from "../utilities/types";
import { IRecipe, RecipeUuid } from "../../store/reducers/food/recipes/types";
import { getAllModelsForAUser, getAllRecipesForAUser, getMealPlanForAUser, getModel, getRecipe } from "../aws/dynamo_utilities";
import { IModelProps, ModelUuid } from "../../store/reducers/printing/types";
import { IMealPlan } from "../../store/reducers/food/meal_plan/types";
import { NewRecipe } from "../../pages/food/[recipeUuid]";

export const sessionQueryKey = (session: CustomSession) => [session?.id ?? ""];
export const recipesQueryKey = (session: CustomSession) => [
  session?.id ?? "",
  "R-",
];
export const recipeQueryKey = (session: CustomSession, id: RecipeUuid) => [
  session?.id ?? "",
  "R-",
  id,
];
export const modelsQueryKey = (session: CustomSession) => [
  session?.id ?? "",
  "M-"
]
export const modelQueryKey = (session: CustomSession, id: ModelUuid) => [
  session?.id ?? "",
  "M-",
  id
]
export const mealPlanQueryKey = (session: CustomSession) => [session?.id ?? "", "MP"]

export const useData = <T>(
  select: (data: IFullStoreState) => T
): WithDefined<UseQueryResult<T>, "data"> => {
  const session = useAppSession();

  const result = useQuery({
    queryKey: sessionQueryKey(session),
    queryFn: () => attemptToFetchUserProfile(session?.id),
    select,
    placeholderData: emptyStore,
  });

  // Note: This is pretty dirty, data will always exist because we have
  // placeholderData, but tanstack doesn't update the type for itself.
  // It will update the type if you use initialData but that value is placed
  // into the cache and we don't want that.
  return {
    ...result,
    data: result.data!,
  };
};

export const attemptToFetchUserProfile = async (
  sessionId?: string
): Promise<IFullStoreState> => {
  if (!sessionId) {
    return clone(initialState);
  }

  const profileResults = await AwsS3Client.send(
    new ListObjectsCommand({
      Bucket: process.env.ENV_AWS_S3_BUCKET_NAME,
      Prefix: `${sessionId}/profile.json`,
      MaxKeys: 1,
    })
  );

  if (profileResults.$metadata.httpStatusCode !== 200) {
    throw new Error("Profile fetch failed");
  }

  // User doesn't have a profile, in this case we should stop trying to fetch a profile
  // and create a new one by dispatching an empty profile
  if (!profileResults?.Contents || profileResults.Contents?.length === 0) {
    return clone(emptyStore);
  }

  const profileUrl = await getS3SignedUrl(`${sessionId}/profile.json`);
  const data = await fetch(profileUrl);

  if (!data.ok) {
    throw new Error(`Response error: ${data.statusText}`);
  }

  let json = await data.json();
  if (!json) {
    throw new Error("No json for user profile");
  }

  json = migrateUserProfile(json);

  return json;
};

export const migrateUserProfile = (profile: IFullStoreState) => {
  for (const migration of [
    migrateMealPlan,
    migrateUser,
    migratePrinting,
    migrateRecipes,
  ]) {
    profile = migration(profile);
  }

  return profile;
};

export const useRecipesOld = () => {
  return useData((data) => data.food.recipes);
};

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
    placeholderData: mealPlanEmptyState.plan
  });

  return {
    ...recipes,
    data: recipes.data!
  };
}


export const useMealPlanOld = () => {
  return useData((data) => data.mealPlan.plan);
};

export const usePrintingOld = () => {
  return useData((data) => data.printing);
};
