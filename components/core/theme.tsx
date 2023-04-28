import { ThemeProvider } from "@mui/material/styles";
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const createThemeFromThemeKey = () => {
  return createTheme({
    palette: {
      primary: {
        main: "#207d39",
        light: "#207d39"
      }
    },
    typography: {
      fontFamily: `"Helvetica", sans-serif`,
      fontSize: 14,
    }
  });
};

export interface IThemeControllerProps {
  children: React.ReactElement;
}

export const ThemeController = (props: IThemeControllerProps) => {
  const theme = useMemo(() => createThemeFromThemeKey(), []);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};
