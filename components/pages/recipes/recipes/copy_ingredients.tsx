import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IRecipe } from "../../../../store/reducers/food/recipes/types";
import { Quantities } from "../../../../store/reducers/food/units";
import { MouseEvent } from "react";

export interface ICopyIngredientsButtonProps {
  recipe: IRecipe;
}

export const CopyIngredientsButton = (props: ICopyIngredientsButtonProps) => {
  const copyIngredients = (event: MouseEvent) => {
    event?.stopPropagation();
    const ingredients = props.recipe.components.flatMap(
      (component) => component.ingredients
    );
    const text = ingredients
      .map((ingredient) =>
        Quantities.toStringWithIngredient(ingredient.name, ingredient.quantity)
      )
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <Tooltip title="Copy ingredients">
      <IconButton
        onClick={copyIngredients}
        size="small"
        sx={{ alignSelf: "center", mr: 1 }}
      >
        <ContentCopyIcon fontSize="small" htmlColor="#212121" />
      </IconButton>
    </Tooltip>
  );
};
