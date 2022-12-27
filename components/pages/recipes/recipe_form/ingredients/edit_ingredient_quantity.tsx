import Input from "@mui/material/Input";
import { ChangeEvent } from "react";
import {
  IRecipeIngredient,
  Unit,
} from "../../../../../store/reducers/food/recipes/types";
import { ComponentsFormData } from "../component_form_data";

export interface IEditIngredientQuantityInputProps {
  ingredient: IRecipeIngredient;
  componentId: string;
  ingredientId: string;
  componentFormData: ComponentsFormData;
  setIngredients: React.Dispatch<
    React.SetStateAction<{ [key: string]: IRecipeIngredient }>
  >;
}

export const EditIngredientQuantityInput = (
  props: IEditIngredientQuantityInputProps
) => {
  const editQuantity = (event: ChangeEvent<HTMLTextAreaElement>) => {
    props.setIngredients((prevIngredients) => {
      const newIngredients = { ...prevIngredients };
      // TODO: Strings such as "3." are valid as the user could be
      // typing 3.5, but if it is converted to a float then the .
      // will be removed leaving 3, aka the user input will have done
      // nothing. An alternative is to store the value as a string
      // till when the user attempts to save and then parse it, but
      // the types are then a nightmare as it uses one type for while
      // it is processing and another for on save.
      newIngredients[props.ingredientId] = {
        ...prevIngredients[props.ingredientId],
        quantity: {
          unit: prevIngredients[props.ingredientId].quantity.unit,
          value:
            event.target.value.length > 0
              ? parseFloat(event.target.value)
              : undefined,
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
    <Input
      value={props.ingredient.quantity.value}
      id="ingredient quantity"
      // variant="standard"
      margin="none"
      type="number"
      multiline
      onKeyPress={(event) => {
        if (!/[0-9.]/.test(event.key)) {
          event.preventDefault();
        }
      }}
      onChange={editQuantity}
      disabled={props.ingredient.quantity.unit === Unit.NO_UNIT}
      error={
        props.ingredient.quantity.unit !== Unit.NO_UNIT &&
        (!props.ingredient.quantity.value ||
          // While the user is filling in the form the type for quantity
          // should really be string,
          isNaN(props.ingredient.quantity.value))
      }
    />
  );
};
