import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IRecipe } from "../../../../../../core/types/recipes";
import { Quantities } from "../../../../../../core/recipes/units";
import { useTemporaryState } from "../../../../../../core/hooks/use_temporary_state";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export interface ICopyIngredientsButtonProps {
  recipe: IRecipe;
}

export const CopyIngredientsButton = (props: ICopyIngredientsButtonProps) => {
  const copyIngredients = () => {
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

  const [tooltip, iconOnClick] = useTemporaryState("Copy ingredients", "Copied!");

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={() => {
          copyIngredients();
          iconOnClick();
        }}
        size="small"
        disableRipple
      >
        <ContentCopyIcon fontSize="small" htmlColor="#212121" />
      </IconButton>
    </Tooltip>
  );
};
