import { UseFormReturn } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { IRecipe } from "../../../../../core/types/recipes";

export const FormServings = ({
  form,
  index,
}: {
  form: UseFormReturn<IRecipe>;
  index: number;
}) => {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <TextField
      label="Servings"
      variant="standard"
      margin="none"
      type="number"
      inputProps={{ step: 0.01 }}
      sx={{ width: "100px" }}
      {...register(`components.${index}.servings`, {
        min: 1,
        validate: (num) => !!num && num > 0,
        required: "A servings value is required",
        valueAsNumber: true,
      })}
      error={!!errors.components?.[index]?.servings}
      helperText={errors.components?.[index]?.servings?.message}
    />
  );
};
