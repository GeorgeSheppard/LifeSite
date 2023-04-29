import { ThemeProvider } from "@mui/material/styles";
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import "@fontsource/roboto";

export const mainGreen = "#207d39";

const rootElement = () => document.getElementById("__next");

export const createThemeFromThemeKey = () => {
  return createTheme({
    palette: {
      primary: {
        main: mainGreen,
        light: "#207d39",
      },
    },
    typography: {
      fontFamily: `"Roboto"`,
      fontSize: 14,
    },
    components: {
      MuiPopover: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiDrawer: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiModal: {
        defaultProps: {
          container: rootElement,
        },
      },
    },
  });
};

export interface IThemeControllerProps {
  children: React.ReactElement;
}

export const ThemeController = (props: IThemeControllerProps) => {
  const theme = useMemo(() => createThemeFromThemeKey(), []);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};
