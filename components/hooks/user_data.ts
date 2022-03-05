import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { useAppDispatch } from "../../store/hooks/hooks";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { login, logout } from "../../store/reducers/user";
import { useRouter } from "next/router";
import { IFullStoreState, store } from "../../store/store";
import useUpload from "./upload_to_server";

export interface IUserDataReturn {
  uploading: boolean;
  upload: () => void;
}

export const useUserData = (): IUserDataReturn => {
  const session = useSession().data as CustomSession;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { uploadFile } = useUpload({
    onStartUpload: () => {
      setUploading(true);
      // We could use onUploadFinished to setUploading to false, but users don't actually
      // care how long it's taking they just want to know it has been triggered
      setTimeout(() => setUploading(false), 1000);
    },
    onUploadError: (err) => {
      setUploading(false);
      console.log(`Error uploading profile data ${err}`);
    },
    folder: "profile",
  });
  const [gotUserData, setGotUserData] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      let data;
      try {
        data = await fetch(`${session.id}/profile/profile.json`);
      } catch (err) {
        console.error(err);
        return;
      }

      if (data.ok && !gotUserData) {
        const json: IFullStoreState = await data.json();
        if (json) {
          setGotUserData(true);
          dispatch(login(json));
        }
      } else if (!data.ok && !gotUserData) {
        setTimeout(() => fetchUserData(), 500);
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
  }, [session?.id, gotUserData, dispatch]);

  const storeUserData = useCallback(() => {
    // Only need to save if a user is logged in
    if (session?.id && gotUserData) {
      const data = store.getState();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const file = new File([blob], "profile.json");
      uploadFile(file, "profile.json");
    }
    // NB: From experience session.id does not guarantee everything has gone through
    // make sure we have successfully retrieved the data otherwise it will override
    // the properties
  }, [uploadFile, session?.id, gotUserData]);

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

  return { upload: storeUserData, uploading };
};
