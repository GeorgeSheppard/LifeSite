import { ThemeProvider } from "@mui/material/styles";
import { useMemo } from "react";
import { useAppSelector } from "../../store/hooks/hooks";
import { createTheme } from "@mui/material/styles";
import { ThemeKey } from "../../store/reducers/user";

export const createThemeFromThemeKey = (themeKey: ThemeKey) => {
  return createTheme({
    palette: {
      mode: themeKey,
    },
  });
};

export interface IThemeControllerProps {
  children: React.ReactElement;
}

export const ThemeController = (props: IThemeControllerProps) => {
  const themeKey = useAppSelector((store) => store.user.theme);
  const theme = useMemo(() => createThemeFromThemeKey(themeKey), [themeKey]);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};
