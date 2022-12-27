import TextField from "@mui/material/TextField";
import React, { ChangeEvent } from "react";
import { IRecipeComponent } from "../../../../store/reducers/food/recipes/types";

export interface IServingsTextFieldProps {
  setServings: React.Dispatch<React.SetStateAction<number>>;
  servings: number;
  component: IRecipeComponent;
}

export const ServingsTextField = (props: IServingsTextFieldProps) => {
  const setServings = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newServings = parseInt(event.target.value, 10);
    const validServings = isNaN(newServings) ? 1 : newServings;
    props.component.servings = validServings;
    props.setServings(validServings);
  };

  return (
    <TextField
      label="Servings"
      value={props.servings}
      id="instruction"
      variant="standard"
      type="number"
      margin="none"
      onChange={setServings}
      sx={{ width: "100px" }}
    />
  );
};
