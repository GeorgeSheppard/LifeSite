import TextField from "@mui/material/TextField";
import { UseFormReturn } from "react-hook-form";
import { IRecipe } from "../../../../../core/types/recipes";

export const FormRecipeName = ({ form }: { form: UseFormReturn<IRecipe> }) => {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <TextField
      key="NameTextField"
      fullWidth
      label="Name"
      variant="standard"
      margin="none"
      {...register("name", {
        required: "A recipe name is required",
      })}
      error={!!errors.name}
      helperText={errors?.name?.message}
    />
  );
};
