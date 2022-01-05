import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./header";
import { useUserData } from "./hooks/user_data";

export interface ILayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: ILayoutProps) {
  useUserData();

  return (
    <>
      <CssBaseline />
      <Header />
      {props.children}
    </>
  );
}
