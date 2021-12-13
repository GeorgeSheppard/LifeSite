import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./header";
import Footer from "./footer";

const theme = createTheme();

export interface ILayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: ILayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      {props.children}
      <Footer />
    </ThemeProvider>
  );
}
