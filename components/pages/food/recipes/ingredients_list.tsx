import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { IRecipeIngredient } from "../../../../core/types/recipes";
import { Quantities } from "../../../../core/recipes/units";

export interface IIngredientsListProps {
  ingredients: IRecipeIngredient[];
}

export const IngredientsList = (props: IIngredientsListProps) => {
  return (
    <>
      <ListItem key="ingredients" sx={{ pb: 2, pl: 1 }}>
        <ListItemText
          primary="Ingredients"
          primaryTypographyProps={{ fontSize: "16px", fontWeight: 550 }}
        />
      </ListItem>
      {props.ingredients.map(({ name, quantity }) => {
        return (
          <ListItem key={name} sx={{ p: 0, pl: 3 }}>
            <ListItemText
              primary={"- " + Quantities.toStringWithIngredient(name, quantity)}
            />
          </ListItem>
        );
      })}
    </>
  );
};