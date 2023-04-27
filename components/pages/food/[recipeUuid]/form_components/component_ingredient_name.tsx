import { UseFormReturn } from "react-hook-form";
import { IRecipe } from "../../../../../core/types/recipes";
import TextField from "@mui/material/TextField";

export const ComponentIngredientName = ({
  form,
  index,
  ingredientIndex,
}: {
  form: UseFormReturn<IRecipe>;
  index: number;
  ingredientIndex: number;
}) => {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <TextField
      fullWidth
      variant="standard"
      margin="none"
      {...register(`components.${index}.ingredients.${ingredientIndex}.name`, {
        required: "The ingredient name is required",
      })}
      error={
        !!errors?.components?.[index]?.ingredients?.[ingredientIndex]?.name
      }
      helperText={
        errors?.components?.[index]?.ingredients?.[ingredientIndex]?.name
          ?.message
      }
    />
  );
};
