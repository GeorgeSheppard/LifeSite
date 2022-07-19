import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { ChangeEvent, memo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  IRecipeIngredient,
  Unit,
} from "../../store/reducers/food/recipes/types";
import { CenteredComponent } from "../core/centered_component";
import { ComponentsFormData } from "./component_form_data";

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
              <TableCell align="right" size="small">
                Unit
              </TableCell>
              <TableCell align="right" size="small">
                Quantity
              </TableCell>
              <TableCell align="right" size="small">
                {" "}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(ingredients).map(([uuid, ingredient]) => (
              <TableRow key={uuid} sx={{ "& td": { border: 0 } }}>
                <TableCell align="left">
                  <TextField
                    fullWidth
                    value={ingredient.name}
                    id="ingredient"
                    variant="standard"
                    margin="none"
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                      setIngredients((prevIngredients) => {
                        const newIngredients = { ...prevIngredients };
                        newIngredients[uuid] = {
                          ...prevIngredients[uuid],
                          name: event.target.value,
                        };
                        props.componentFormData.updateIngredients(
                          props.uuid,
                          Object.values(newIngredients)
                        );
                        return newIngredients;
                      });
                    }}
                    error={ingredient.name.length === 0}
                  />
                </TableCell>
                <TableCell align="right" size="small">
                  <FormControl variant="standard">
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={ingredient.quantity.unit}
                      margin="none"
                      onChange={(event: SelectChangeEvent) => {
                        setIngredients((prevIngredients) => {
                          const newIngredients = { ...prevIngredients };
                          newIngredients[uuid] = {
                            ...prevIngredients[uuid],
                            quantity: {
                              unit: event.target.value as Unit,
                              value: prevIngredients[uuid].quantity.value,
                            },
                          };
                          props.componentFormData.updateIngredients(
                            props.uuid,
                            Object.values(newIngredients)
                          );
                          return newIngredients;
                        });
                      }}
                      label="Unit"
                      sx={{ width: "90px" }}
                      error={!ingredient.quantity.unit}
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
                </TableCell>
                <TableCell align="right" size="small">
                  <TextField
                    value={ingredient.quantity.value}
                    id="ingredient quantity"
                    variant="standard"
                    margin="none"
                    multiline
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                      setIngredients((prevIngredients) => {
                        const newIngredients = { ...prevIngredients };
                        // TODO: Strings such as "3." are valid as the user could be
                        // typing 3.5, but if it is converted to a float then the .
                        // will be removed leaving 3, aka the user input will have done
                        // nothing. An alternative is to store the value as a string
                        // till when the user attempts to save and then parse it, but
                        // the types are then a nightmare as it uses one type for while
                        // it is processing and another for on save.
                        newIngredients[uuid] = {
                          ...prevIngredients[uuid],
                          quantity: {
                            unit: prevIngredients[uuid].quantity.unit,
                            value: parseFloat(event.target.value),
                          },
                        };
                        props.componentFormData.updateIngredients(
                          props.uuid,
                          Object.values(newIngredients)
                        );
                        return newIngredients;
                      });
                    }}
                    sx={{ width: "50px" }}
                    disabled={ingredient.quantity.unit === Unit.NO_UNIT}
                    error={
                      ingredient.quantity.unit !== Unit.NO_UNIT &&
                      (!ingredient.quantity.value ||
                        // While the user is filling in the form the type for quantity
                        // should really be string,
                        isNaN(ingredient.quantity.value))
                    }
                  />
                </TableCell>
                <TableCell align="right" size="small">
                  <IconButton
                    onClick={() => {
                      setIngredients((prevIngredients) => {
                        const newIngredients = { ...prevIngredients };
                        delete newIngredients[uuid];
                        props.componentFormData.updateIngredients(
                          props.uuid,
                          Object.values(newIngredients)
                        );
                        return newIngredients;
                      });
                    }}
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
      <CenteredComponent>
        <Button
          onClick={() => {
            setIngredients((prevIngredients) => {
              const newIngredients = { ...prevIngredients };
              newIngredients[uuidv4()] = {
                name: "",
                quantity: { unit: Unit.GRAM },
              };
              props.componentFormData.updateIngredients(
                props.uuid,
                Object.values(newIngredients)
              );
              return newIngredients;
            });
          }}
          startIcon={<AddIcon />}
        >
          New ingredient
        </Button>
      </CenteredComponent>
    </>
  );
});
