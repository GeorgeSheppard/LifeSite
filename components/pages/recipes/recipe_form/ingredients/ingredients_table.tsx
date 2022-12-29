import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { memo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IRecipeIngredient } from "../../../../../store/reducers/food/recipes/types";
import { ComponentsFormData } from "../component_form_data";
import { AddIngredientButton } from "./add_ingredient";
import { DeleteIngredientButton } from "./delete_ingredient";
import { EditIngredientNameTextField } from "./edit_ingredient_name";
import { EditIngredientQuantityInput } from "./edit_ingredient_quantity";
import { EditIngredientUnitSelect } from "./edit_ingredient_unit";

export interface IIngredientsInputTableProps {
  componentFormData: ComponentsFormData;
  uuid: string;
}

export const IngredientsInputTable = memo(function IngredientTable(
  props: IIngredientsInputTableProps
) {
  const [ingredients, setIngredients] = useState(() => {
    const obj: { [key: string]: IRecipeIngredient } = {};
    for (const value of props.componentFormData.components[props.uuid]
      .ingredients) {
      obj[uuidv4()] = value;
    }
    return obj;
  });

  return (
    <>
      <TableContainer component={"div"}>
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
            {Object.entries(ingredients).map(([uuid, ingredient]) => (
              <TableRow key={uuid} sx={{ "& td": { border: 0 } }}>
                <TableCell align="left">
                  <EditIngredientNameTextField
                    componentFormData={props.componentFormData}
                    ingredient={ingredient}
                    componentId={props.uuid}
                    ingredientId={uuid}
                    setIngredients={setIngredients}
                  />
                </TableCell>
                <TableCell width="120px" align="left" size="small">
                  <EditIngredientUnitSelect
                    componentFormData={props.componentFormData}
                    ingredient={ingredient}
                    componentId={props.uuid}
                    ingredientId={uuid}
                    setIngredients={setIngredients}
                  />
                </TableCell>
                <TableCell width="110px" align="left" size="small">
                  <EditIngredientQuantityInput
                    componentFormData={props.componentFormData}
                    ingredient={ingredient}
                    componentId={props.uuid}
                    ingredientId={uuid}
                    setIngredients={setIngredients}
                  />
                </TableCell>
                <TableCell align="left" width="70px" size="small">
                  <DeleteIngredientButton
                    componentFormData={props.componentFormData}
                    ingredient={ingredient}
                    componentId={props.uuid}
                    ingredientId={uuid}
                    setIngredients={setIngredients}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddIngredientButton
        componentFormData={props.componentFormData}
        componentId={props.uuid}
        setIngredients={setIngredients}
      />
    </>
  );
});
