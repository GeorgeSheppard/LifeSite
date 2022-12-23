import { useCallback } from "react";
import { IFullStoreState, isStoreValid, MutateFunc } from "../../store/store";
import useUploadToS3 from "./upload_to_s3";
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
