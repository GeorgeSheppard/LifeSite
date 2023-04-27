import { UseFormReturn } from "react-hook-form";
import { IRecipe } from "../../../../../core/types/recipes";
import TextField from "@mui/material/TextField";

export const FormComponentName = ({
  form,
  id,
  index,
}: {
  form: UseFormReturn<IRecipe>;
  id: string;
  index: number;
}) => {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <TextField
      key={`Name:${id}`}
      fullWidth
      label="Name"
      variant="standard"
      margin="none"
      {...register(`components.${index}.name`, {
        required: "A component name is required",
      })}
      error={
        !!errors.components?.[index]?.name ||
        !!errors.components?.[index]?.ingredients?.root
      }
      helperText={
        errors.components?.[index]?.name?.message ??
        errors.components?.[index]?.ingredients?.root?.message
      }
    />
  );
};
