import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { useQuery } from "@tanstack/react-query";
import clone from "just-clone";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { migrateMealPlan } from "../../store/reducers/food/meal_plan/meal_plan";
import { migrateRecipes } from "../../store/reducers/food/recipes/recipes";
import { migratePrinting } from "../../store/reducers/printing/printing";
import { migrateUser } from "../../store/reducers/user/user";
import { emptyStore, IFullStoreState, initialState } from "../../store/store";
import { AwsS3Client } from "../aws/s3_client";
import { getS3SignedUrl } from "../aws/s3_utilities";
import { useAppSession } from "./use_app_session";

export const sessionQueryKey = (session: CustomSession) => [session?.id ?? ""];

export const useData = <T>(select: (data: IFullStoreState) => T) => {
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

export const useRecipes = () => {
  return useData((data) => data.food.recipes);
};

export const useMealPlan = () => {
  return useData((data) => data.mealPlan.plan);
};

export const usePrinting = () => {
  return useData((data) => data.printing);
};
