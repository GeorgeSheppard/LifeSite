import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { useAppDispatch } from "../../store/hooks/hooks";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { login, logout, userEmptyState } from "../../store/reducers/user/user";
import { useRouter } from "next/router";
import { IFullStoreState, isStoreValid, store } from "../../store/store";
import useUploadToS3 from "./upload_to_s3";
import { getS3SignedUrl } from "../aws/s3_utilities";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { AwsS3Client } from "../aws/s3_client";
import { printingEmptyState } from "../../store/reducers/printing/printing";
import { plantsEmptyState } from "../../store/reducers/plants/plants";
import { recipesEmptyState } from "../../store/reducers/food/recipes/recipes";
import { mealPlanEmptyState } from "../../store/reducers/food/meal_plan/meal_plan";

export interface IUserDataReturn {
  uploading: boolean;
  canUpload: boolean;
  upload: () => void;
  offline: boolean;
}

export const useUserData = (): IUserDataReturn => {
  const session = useSession().data as CustomSession;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [offline, setOffline] = useState(false);
  const { uploadFile } = useUploadToS3({
    onStartUpload: () => {
      setUploading(true);
      if (offline) {
        setOffline(false);
      }
      // We could use onUploadFinished to setUploading to false, but users don't actually
      // care how long it's taking they just want to know it has been triggered
      setTimeout(() => setUploading(false), 1000);
    },
    onUploadError: (err) => {
      setUploading(false);
      setOffline(true);
      console.log(`Error uploading profile data ${err}`);
    },
    // We don't want multiple copies of the profile, and we want it to be at a predictable path
    makeKeyUnique: false,
  });
  const [gotUserData, setGotUserData] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Only need to save if a user is logged in
  const canUpload = !!session?.id && gotUserData;

  useEffect(() => {
    const fetchUserData = async () => {
      const { failed, json } = await attemptToFetchUserProfile(session.id);

      if (failed) {
        setOffline(true);
        return;
      } else if (offline) {
        setOffline(false);
      }

      if (json && !gotUserData) {
        setGotUserData(true);
        dispatch(login(json));
      }
    };

    if (!session?.id && gotUserData) {
      // NB: No session id, user has logged out
      setGotUserData(false);
      dispatch(logout());
    }

    if (session?.id && !gotUserData) {
      fetchUserData();
    }
  }, [session?.id, gotUserData, dispatch, offline, setOffline]);

  const storeUserData = useCallback(() => {
    if (canUpload) {
      const data = store.getState();

      // We allow production users to upload their corrupted file (if they manage to get it in that state)
      // but for development it is better to just prevent uploading
      if (process.env.NODE_ENV === "development" && !isStoreValid(data)) {
        console.error(
          `Store data is not valid, prevented upload: ${JSON.stringify(data)}`
        );
        return;
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const file = new File([blob], "profile.json");
      uploadFile(file);
    }
    // NB: From experience session.id does not guarantee everything has gone through
    // make sure we have successfully retrieved the data otherwise it will override
    // the properties
  }, [uploadFile, canUpload]);

  // Save the user data if the user closes the webpage
  useEffect(() => {
    window.addEventListener("beforeunload", storeUserData);
    return () => {
      window.removeEventListener("beforeunload", storeUserData);
    };
  }, [storeUserData, router.events]);

  return { upload: storeUserData, uploading, canUpload, offline };
};

interface IProfileResults {
  failed?: boolean;
  json?: IFullStoreState;
}

const attemptToFetchUserProfile = async (
  sessionId: string
): Promise<IProfileResults> => {
  const profileResults = await AwsS3Client.send(
    new ListObjectsCommand({
      Bucket: process.env.ENV_AWS_S3_BUCKET_NAME,
      Prefix: `${sessionId}/profile.json`,
      MaxKeys: 1,
    })
  );

  if (profileResults.$metadata.httpStatusCode !== 200) {
    return { failed: true };
  }

  // User doesn't have a profile, in this case we should stop trying to fetch a profile
  // and create a new one by dispatching an empty profile
  if (!profileResults?.Contents || profileResults.Contents?.length === 0) {
    return {
      json: {
        user: userEmptyState,
        printing: printingEmptyState,
        plants: plantsEmptyState,
        food: recipesEmptyState,
        mealPlan: mealPlanEmptyState,
      },
    };
  }

  const profileUrl = await getS3SignedUrl(`${sessionId}/profile.json`);
  const data = await fetch(profileUrl);

  if (!data.ok) {
    console.error("Response error status", data.statusText);
    return { failed: true };
  }

  const json = await data.json();
  if (!json) {
    console.error("No json for user profile");
    return { failed: true };
  }

  return { json };
};
