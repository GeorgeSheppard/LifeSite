import { UseFormReturn } from "react-hook-form";
import { IRecipe } from "../../../../../core/types/recipes";
import TextField from "@mui/material/TextField";

export const FormDescription = ({ form }: { form: UseFormReturn<IRecipe> }) => {
  const { register } = form;
  return (
    <TextField
      key="DescriptionTextField"
      fullWidth
      label="Description"
      variant="standard"
      margin="none"
      sx={{ mt: 2 }}
      {...register("description")}
    />
  );
};
