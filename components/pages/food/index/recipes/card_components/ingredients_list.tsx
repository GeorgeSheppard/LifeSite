import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { IRecipeIngredient } from "../../../../../../core/types/recipes";
import { Quantities } from "../../../../../../core/recipes/units";
import { Typography } from "@mui/material";

export interface IIngredientsListProps {
  ingredients: IRecipeIngredient[];
}

export const IngredientsList = (props: IIngredientsListProps) => {
  return (
    <>
      <ListItem key="ingredients" sx={{ pb: 2, pl: 1 }}>
        <ListItemText
          primaryTypographyProps={{ variant: "subtitle2" }}
          primary="Ingredients"
        />
      </ListItem>
      {props.ingredients.map(({ name, quantity }) => {
        return (
          <ListItem key={name} sx={{ p: 0, pl: 3 }}>
            <ListItemText
              primaryTypographyProps={{ variant: "body2" }}
              primary={"- " + Quantities.toStringWithIngredient(name, quantity)}
            />
          </ListItem>
        );
      })}
    </>
  );
};
