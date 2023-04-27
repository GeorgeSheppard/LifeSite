import { UseFormReturn, useFieldArray } from "react-hook-form";
import { IRecipe, Unit } from "../../../../../core/types/recipes";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { ComponentIngredientName } from "./component_ingredient_name";
import { ComponentIngredientUnit } from "./component_ingredient_unit";
import { ComponentIngredientQuantity } from "./component_ingredient_quantity";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export const getDefaultIngredient = () => ({
  name: "",
  quantity: { unit: Unit.GRAM, value: 1 },
});

export const IngredientsList = ({
  index,
  form,
}: {
  index: number;
  form: UseFormReturn<IRecipe>;
}) => {
  const {
    control,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `components.${index}.ingredients`,
    rules: {
      minLength: 1,
      required: "At least one ingredient is required",
    },
  });

  return (
    <>
      <TableContainer component="div">
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ingredient</TableCell>
              <TableCell width="120px" align="left" size="small">
                Unit
              </TableCell>
              <TableCell width="110px" align="left" size="small">
                Quantity
              </TableCell>
              <TableCell width="70px" align="left" size="small">
                {" "}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, ingredientIndex) => (
              <TableRow key={field.id} sx={{ "& td": { border: 0 } }}>
                <TableCell align="left">
                  <ComponentIngredientName
                    form={form}
                    index={index}
                    ingredientIndex={ingredientIndex}
                  />
                </TableCell>
                <TableCell width="120px" align="left" size="small">
                  <ComponentIngredientUnit
                    form={form}
                    index={index}
                    ingredientIndex={ingredientIndex}
                  />
                </TableCell>
                <TableCell width="110px" align="left" size="small">
                  <ComponentIngredientQuantity
                    form={form}
                    index={index}
                    ingredientIndex={ingredientIndex}
                  />
                </TableCell>
                <TableCell align="left" width="70px" size="small">
                  <IconButton
                    onClick={() => remove(ingredientIndex)}
                    size="small"
                    sx={{ alignSelf: "center" }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {errors?.components?.[index]?.ingredients?.root && (
        <Alert severity="error">
          {errors?.components?.[index]?.ingredients?.root?.message}
        </Alert>
      )}
      <Button
        className="center p8"
        sx={{ mt: 3 }}
        onClick={() => append(getDefaultIngredient())}
        startIcon={<AddIcon />}
      >
        New ingredient
      </Button>
    </>
  );
};
