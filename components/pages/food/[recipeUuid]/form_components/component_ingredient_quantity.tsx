import { UseFormReturn } from "react-hook-form";
import { IRecipe, Unit } from "../../../../../core/types/recipes";
import TextField from "@mui/material/TextField";

export const ComponentIngredientQuantity = ({
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
    watch,
  } = form;
  return (
    <TextField
      variant="standard"
      margin="none"
      type="number"
      inputProps={{ step: 0.01 }}
      {...register(
        `components.${index}.ingredients.${ingredientIndex}.quantity.value`,
        {
          min: 0,
          valueAsNumber: true,
          validate: (value, formValues) =>
            formValues.components[index].ingredients[ingredientIndex].quantity
              .unit === Unit.NO_UNIT
              ? !value || isNaN(value)
              : !!value,
        }
      )}
      error={
        !!errors?.components?.[index]?.ingredients?.[ingredientIndex]?.quantity
          ?.value
      }
      disabled={
        watch(
          `components.${index}.ingredients.${ingredientIndex}.quantity.unit`
        ) === Unit.NO_UNIT
      }
    />
  );
};
