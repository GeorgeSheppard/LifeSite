import { UseFormReturn } from "react-hook-form";
import { IRecipe, Unit } from "../../../../../core/types/recipes";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getDefaultIngredient } from "./component_ingredients";

export const ComponentIngredientUnit = ({
  form,
  index,
  ingredientIndex,
}: {
  form: UseFormReturn<IRecipe>;
  index: number;
  ingredientIndex: number;
}) => {
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = form;
  return (
    <FormControl variant="standard">
      <Select
        margin="none"
        label="Unit"
        value={
          watch(
            `components.${index}.ingredients.${ingredientIndex}.quantity.unit`
          ) ?? getDefaultIngredient().quantity.unit
        }
        {...register(
          `components.${index}.ingredients.${ingredientIndex}.quantity.unit`,
          {
            required: "A unit is required",
          }
        )}
        onChange={(e) => {
          if (e.target.value === Unit.NO_UNIT) {
            setValue(
              `components.${index}.ingredients.${ingredientIndex}.quantity.value`,
              undefined
            );
          }
          setValue(
            `components.${index}.ingredients.${ingredientIndex}.quantity.unit`,
            e.target.value as Unit
          );
        }}
        error={
          !!errors?.components?.[index]?.ingredients?.[ingredientIndex]
            ?.quantity?.unit
        }
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
