import { UseFormReturn } from "react-hook-form";
import { IRecipe } from "../../../../../core/types/recipes";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export const FormStoreable = ({
  form,
  index,
}: {
  form: UseFormReturn<IRecipe>;
  index: number;
}) => {
  const { register } = form;
  return (
    <Tooltip title="Can it last in the cupboard, or freezer">
      <FormControlLabel
        control={
          <Checkbox
            {...register(`components.${index}.storeable`)}
            size="small"
          />
        }
        label="Storeable"
        sx={{ ml: 5 }}
      />
    </Tooltip>
  );
};
