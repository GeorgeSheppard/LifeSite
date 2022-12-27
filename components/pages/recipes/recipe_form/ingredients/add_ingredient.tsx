import { ComponentsFormData } from "../component_form_data";
import {
  IRecipeIngredient,
  Unit,
} from "../../../../../store/reducers/food/recipes/types";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";

export interface IAddIngredientButtonProps {
  componentId: string;
  componentFormData: ComponentsFormData;
  setIngredients: React.Dispatch<
    React.SetStateAction<{ [key: string]: IRecipeIngredient }>
  >;
}

export const AddIngredientButton = (props: IAddIngredientButtonProps) => {
  return (
    <Button
      className="center p8"
      sx={{ mt: 3 }}
      onClick={() => {
        props.setIngredients((prevIngredients) => {
          const newIngredients = { ...prevIngredients };
          newIngredients[uuidv4()] = {
            name: "",
            quantity: { unit: Unit.GRAM },
          };
          props.componentFormData.updateIngredients(
            props.componentId,
            Object.values(newIngredients)
          );
          return newIngredients;
        });
      }}
      startIcon={<AddIcon />}
    >
      New ingredient
    </Button>
  );
};
