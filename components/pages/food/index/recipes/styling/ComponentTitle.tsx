import { Typography, TypographyProps } from "@mui/material";
import tw from "tailwind-styled-components";

const StyledComponentTitle = tw(Typography)`
  grow
  my-auto
`;

export const ComponentTitle = (props: TypographyProps) => (
  <StyledComponentTitle variant="subtitle2" color="#717171" {...props} />
);
