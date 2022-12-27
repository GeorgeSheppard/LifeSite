import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  IRecipeIngredient,
  Unit,
} from "../../../../../store/reducers/food/recipes/types";
import { ComponentsFormData } from "../component_form_data";

export interface IEditIngredientUnitSelectProps {
  ingredient: IRecipeIngredient;
  componentId: string;
  ingredientId: string;
  componentFormData: ComponentsFormData;
  setIngredients: React.Dispatch<
    React.SetStateAction<{ [key: string]: IRecipeIngredient }>
  >;
}

export const EditIngredientUnitSelect = (
  props: IEditIngredientUnitSelectProps
) => {
  const editQuantity = (event: SelectChangeEvent) => {
    props.setIngredients((prevIngredients) => {
      const newIngredients = { ...prevIngredients };
      newIngredients[props.ingredientId] = {
        ...prevIngredients[props.ingredientId],
        quantity: {
          unit: event.target.value as Unit,
          value: prevIngredients[props.ingredientId].quantity.value,
        },
      };
      props.componentFormData.updateIngredients(
        props.componentId,
        Object.values(newIngredients)
      );
      return newIngredients;
    });
  };

  return (
    <FormControl variant="standard">
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={props.ingredient.quantity.unit}
        margin="none"
        onChange={editQuantity}
        label="Unit"
        error={!props.ingredient.quantity.unit}
      >
        {Object.entries(Unit).map((value) => {
          return (
            <MenuItem key={value[0]} value={value[1]}>
              {value[1]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
