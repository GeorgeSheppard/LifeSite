import { Typography, TypographyProps } from "@mui/material";
import tw from "tailwind-styled-components";

const StyledRecipeTitle = tw(Typography)`
  grow
  my-auto
  font-[500]
`;

export const RecipeTitle = (props: TypographyProps) => (
  <StyledRecipeTitle variant="subtitle1" color="#222222" {...props} />
);
