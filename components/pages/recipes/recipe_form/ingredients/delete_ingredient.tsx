import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ComponentsFormData } from "../component_form_data";
import { IRecipeIngredient } from "../../../../../store/reducers/food/recipes/types";

export interface IDeleteIngredientButtonProps {
  ingredient: IRecipeIngredient;
  componentId: string;
  ingredientId: string;
  componentFormData: ComponentsFormData;
  setIngredients: React.Dispatch<
    React.SetStateAction<{ [key: string]: IRecipeIngredient }>
  >;
}

export const DeleteIngredientButton = (props: IDeleteIngredientButtonProps) => {
  const deleteIngredient = () => {
    props.setIngredients((prevIngredients) => {
      const newIngredients = { ...prevIngredients };
      delete newIngredients[props.ingredientId];
      props.componentFormData.updateIngredients(
        props.componentId,
        Object.values(newIngredients)
      );
      return newIngredients;
    });
  };

  return (
    <IconButton
      onClick={deleteIngredient}
      size="small"
      sx={{ alignSelf: "center" }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};
