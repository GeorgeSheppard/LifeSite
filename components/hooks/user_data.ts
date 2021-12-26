import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { useAppDispatch } from "../../store/hooks/hooks";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { IFullStoreState, login } from "../../store/reducers/user";
import { useRouter } from "next/router";
import { store } from "../../store/store";
import useUpload from "./upload_to_server";

export const useUserData = () => {
  const session = useSession().data as CustomSession;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { uploadFile } = useUpload({
    onStartUpload: () => console.log("start upload"),
    onUploadFinished: () => console.log("user data saved"),
    onUploadError: (err) => console.log(err),
    folder: "profile",
  });
  const [gotUserData, setGotUserData] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      let data;
      try {
        data = await fetch(`${session.id}/profile/profile.json`);
        if (!data.ok) {
          console.log("using default profile");
          data = await fetch("defaultProfile.json");
        }
      } catch (err) {
        console.error(err);
        return;
      }

      if (data.ok) {
        const json: IFullStoreState = await data.json();
        setGotUserData(true);
        dispatch(login(json));
      }
    };

    if (session?.id && !gotUserData) {
      fetchUserData();
    }
  }, [session?.id, gotUserData, dispatch]);

  const storeUserData = useCallback(() => {
    // Only need to save if a user is logged in
    if (session?.id) {
      const data = store.getState();
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      const file = new File([blob], "profile.json");
      uploadFile(file, "profile.json");
    }
  }, [uploadFile, session?.id]);

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
};
