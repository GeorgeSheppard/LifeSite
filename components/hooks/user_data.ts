import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { useAppDispatch } from "../../store/hooks/hooks";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { login, logout, userEmptyState } from "../../store/reducers/user";
import { useRouter } from "next/router";
import { IFullStoreState, store } from '../../store/store';
import useUploadToS3 from "./upload_to_s3";
import { getS3SignedUrl } from "../aws/s3_utilities";
import { clearTimeout } from "timers";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { AwsS3Client } from "../aws/s3_client";
import { printingEmptyState } from "../../store/reducers/printing";
import { plantsEmptyState } from "../../store/reducers/plants";
import { foodEmptyState } from "../../store/reducers/food/recipes";

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
    makeKeyUnique: false
  });
  const [gotUserData, setGotUserData] = useState(false);
  const [uploading, setUploading] = useState(false);

  const canUpload = useMemo(() => {
    // Only need to save if a user is logged in
    return !!session?.id && gotUserData
  }, [session?.id, gotUserData]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const fetchUserData = async () => {
      let json: IFullStoreState | undefined = undefined;
      try {
        const profileResults = await AwsS3Client.send(new ListObjectsCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Prefix: `${session.id}/profile.json`, MaxKeys: 1 }))

        if (profileResults.$metadata.httpStatusCode !== 200) {
          setOffline(true);
        }
        
        if (profileResults.$metadata.httpStatusCode === 200) {
          if (offline) {
            setOffline(false);
          }

          // User doesn't have a profile, in this case we should stop trying to fetch a profile
          // and create a new one by dispatching an empty profile
          if (profileResults.Contents?.length === 0) {
            json = {
              user: userEmptyState,
              printing: printingEmptyState,
              plants: plantsEmptyState,
              food: foodEmptyState
            }
          }
  
  
          const profileUrl = await getS3SignedUrl(`${session.id}/profile.json`);
          const data = await fetch(profileUrl);
          if (data.ok) {
            json = await data.json();
          }
        }
      } catch (err) {
        console.error(err);
      }

      if (json && !gotUserData) {
          setGotUserData(true);
          dispatch(login(json));
      } else {
        timerId = setTimeout(() => fetchUserData(), 20000);
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

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    };
  }, [session?.id, gotUserData, dispatch, offline, setOffline]);

  const storeUserData = useCallback(() => {
    if (canUpload) {
      const data = store.getState();
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

  // Save the user data everytime the route changes
  // And if the user closes the webpage
  useEffect(() => {
    router.events.on("routeChangeStart", storeUserData);
    window.addEventListener("beforeunload", storeUserData);
    return () => {
      router.events.off("routeChangeStart", storeUserData);
      window.removeEventListener("beforeunload", storeUserData);
    };
  }, [storeUserData, router.events]);

  return { upload: storeUserData, uploading, canUpload, offline };
};
