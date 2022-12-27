import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";
import { IRecipeIngredient } from "../../../../../store/reducers/food/recipes/types";
import { ComponentsFormData } from "../component_form_data";

export interface IEditIngredientNameTextFieldProps {
  ingredient: IRecipeIngredient;
  componentId: string;
  ingredientId: string;
  componentFormData: ComponentsFormData;
  setIngredients: React.Dispatch<
    React.SetStateAction<{ [key: string]: IRecipeIngredient }>
  >;
}

export const EditIngredientNameTextField = (
  props: IEditIngredientNameTextFieldProps
) => {
  const editIngredient = (event: ChangeEvent<HTMLTextAreaElement>) => {
    props.setIngredients((prevIngredients) => {
      const newIngredients = { ...prevIngredients };
      newIngredients[props.ingredientId] = {
        ...prevIngredients[props.ingredientId],
        name: event.target.value,
      };
      props.componentFormData.updateIngredients(
        props.componentId,
        Object.values(newIngredients)
      );
      return newIngredients;
    });
  };

  return (
    <TextField
      fullWidth
      value={props.ingredient.name}
      id="ingredient"
      variant="standard"
      margin="none"
      onChange={editIngredient}
      error={props.ingredient.name.length === 0}
    />
  );
};
