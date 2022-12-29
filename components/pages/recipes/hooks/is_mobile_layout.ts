import { useMediaQuery, useTheme } from "@mui/material";

export const useIsMobileLayout = () => {
  const theme = useTheme();
  const mobileLayout = useMediaQuery(theme.breakpoints.down("lg"));
  return mobileLayout;
};
