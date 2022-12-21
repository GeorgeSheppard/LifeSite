import { useCallback } from "react";
import { migrateUser } from "../../store/reducers/user/user";
import {
  emptyStore,
  IFullStoreState,
  initialState,
  isStoreValid,
  MutateFunc,
} from "../../store/store";
import useUploadToS3 from "./upload_to_s3";
import { getS3SignedUrl } from "../aws/s3_utilities";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { AwsS3Client } from "../aws/s3_client";
import { migratePrinting } from "../../store/reducers/printing/printing";
import { migratePlants } from "../../store/reducers/plants/plants";
import { migrateRecipes } from "../../store/reducers/food/recipes/recipes";
import { migrateMealPlan } from "../../store/reducers/food/meal_plan/meal_plan";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import clone from "just-clone";
import { useAppSession } from "./use_app_session";
import { sessionQueryKey } from "./use_data";

export interface IUserDataReturn {
  uploading: boolean;
  canUpload: boolean;
  upload: () => void;
}

export const useMutateAndStore = <TVariables>(
  mutation: MutateFunc<TVariables>
) => {
  const session = useAppSession();
  const { uploadFile } = useUploadToS3({
    onUploadError: (err) => {
      console.log(`Error uploading profile data ${err}`);
    },
    // We don't want multiple copies of the profile, and we want it to be at a predictable path
    makeKeyUnique: false,
  });

  const queryClient = useQueryClient();

  const mutateAndStore = useCallback(async () => {
    const currentStoreState = queryClient.getQueryData<IFullStoreState>(
      sessionQueryKey(session)
    );
    if (!currentStoreState) {
      throw new Error("No current store state");
    }

    // We allow production users to upload their corrupted file (if they manage to get it in that state)
    // but for development it is better to just prevent uploading
    if (
      process.env.NODE_ENV === "development" &&
      !isStoreValid(currentStoreState)
    ) {
      throw new Error(
        `Store data is not valid, prevented upload: ${JSON.stringify(
          currentStoreState
        )}`
      );
    }
    if (!session) {
      return currentStoreState;
    }
    const blob = new Blob([JSON.stringify(currentStoreState, null, 2)], {
      type: "application/json",
    });
    const file = new File([blob], "profile.json");
    await uploadFile(file);
    return currentStoreState;
  }, [uploadFile, queryClient, session]);

  return useMutation(mutateAndStore, {
    onMutate: async (variables: TVariables) => {
      const profileQueryKey = sessionQueryKey(session);
      await queryClient.cancelQueries({ queryKey: profileQueryKey });

      const previousValue =
        queryClient.getQueryData<IFullStoreState>(profileQueryKey);

      if (!previousValue) {
        throw new Error("Failed to update profile");
      }

      queryClient.setQueryData(profileQueryKey, () =>
        mutation(clone(previousValue), variables)
      );

      return { previousValue };
    },
    onError: (err, __, context) => {
      const previousValue = context?.previousValue;
      if (previousValue) {
        queryClient.setQueryData(sessionQueryKey(session), previousValue);
      }
      console.error(`Error updating profile: ${err}`);
    },
    onSettled: () => {
      if (session) {
        queryClient.invalidateQueries({ queryKey: sessionQueryKey(session) });
      }
    },
  });
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
    migratePlants,
    migratePrinting,
    migrateRecipes,
  ]) {
    profile = migration(profile);
  }

  return profile;
};
