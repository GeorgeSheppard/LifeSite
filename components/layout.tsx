import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./header";
import { theme } from "../pages/_theme";
import { useUserData } from "./hooks/user_data";

export interface ILayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: ILayoutProps) {
  useUserData();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      {props.children}
    </ThemeProvider>
  );
}
