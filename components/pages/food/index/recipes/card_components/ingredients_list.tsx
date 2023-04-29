import { IRecipeIngredient } from "../../../../../../core/types/recipes";
import { Quantities } from "../../../../../../core/recipes/units";
import Typography from "@mui/material/Typography";

export interface IIngredientsListProps {
  ingredients: IRecipeIngredient[];
}

export const IngredientsList = (props: IIngredientsListProps) => {
  return (
    <div>
      <Typography variant="body2" fontSize={12} fontWeight={600}>
        Ingredients
      </Typography>
      <div className="ml-4 space-y-1">
      {props.ingredients.map(({ name, quantity }) => {
        return (
          <Typography key={name} variant="body2" fontSize={12}>
            {"- " + Quantities.toStringWithIngredient(name, quantity)}
          </Typography>
        );
      })}
      </div>
    </div>
  );
};
