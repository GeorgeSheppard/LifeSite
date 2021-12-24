import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./header";
import { theme } from "../pages/_theme";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CustomSession } from "../pages/api/auth/[...nextauth]";
import { IFullStoreState, login } from "../store/reducers/user";
import { useAppDispatch } from "../store/hooks/hooks";

export interface ILayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: ILayoutProps) {
  const session = useSession().data as CustomSession;
  const dispatch = useAppDispatch();
  const [gotUserData, setGotUserData] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      let data;
      try {
        data = await fetch(`${session.id}/profile.json`);
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      {props.children}
    </ThemeProvider>
  );
}
