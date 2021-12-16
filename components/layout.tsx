import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./header";
import { theme } from "../pages/_theme";

export interface ILayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: ILayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      {props.children}
    </ThemeProvider>
  );
}
