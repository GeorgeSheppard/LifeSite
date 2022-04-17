import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import {
  addOrUpdateRecipe,
  IIngredient,
  IRecipeComponent,
  IRecipeIngredient,
  RecipeUuid,
} from "../../store/reducers/food/recipes";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import {
  ChangeEvent,
  createRef,
  useRef,
  useState,
  RefObject,
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  memo,
} from "react";
import Grid from "@mui/material/Grid";
import { stopPropagation } from "../../components/cards/utilities";
import TextField from "@mui/material/TextField";
import { UploadDisplayImages } from "../../components/cards/upload_and_display_images";
import {
  AccordionDetails,
  IconButton,
  List,
  ListItemText,
  Paper,
  Tooltip,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import { ExitSaveButtons } from "../../components/cards/exit_save_buttons";
import { useCardsWithIds } from "../../components/hooks/use_cards";
import { Unit } from "../../store/reducers/food/units";
import { useBoolean } from "../../components/hooks/use_boolean";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/router";

const EditUploadRecipe = () => {
  const router = useRouter();
  const [uuid] = useState(router.query.recipeUuid as RecipeUuid);
  const dispatch = useAppDispatch();
  const recipeData = useAppSelector((store) => {
    if (uuid in store.food.recipes) {
      return store.food.recipes[uuid];
    } else {
      return {
        uuid,
        name: "",
        description: "",
        images: [],
        components: [
          {
            name: "",
            ingredients: [],
            instructions: [],
            storeable: false,
          },
        ],
      };
    }
  });

  const {
    deleteIndex,
    insertIndex,
    replaceIndex,
    cards: components,
  } = useCardsWithIds({
    initialCards: recipeData.components,
    generateValue: () => ({
      name: "",
      ingredients: [],
      instructions: [],
      storeable: false,
    }),
  });

  const [recipeName, setRecipeName] = useState(recipeData.name);
  const [description, setDescription] = useState(recipeData.description);
  const [images, setImages] = useState(recipeData.images);
  const [formAlert, setFormAlert] = useState<string | null>(null);

  const dispatchRecipe = useCallback(() => {
    if (recipeName.length === 0) {
      setFormAlert("Please set recipe name");
      return;
    }

    if (
      components.length === 1 &&
      components[0].value.ingredients.length === 0 &&
      components[0].value.instructions.length === 0
    ) {
      setFormAlert("Please set an ingredient or instruction");
      return;
    }

    dispatch(
      addOrUpdateRecipe({
        uuid: recipeData.uuid,
        name: recipeName,
        description,
        images,
        components: components.map((component) => component.value),
      })
    );
    router.push("/food/recipes");
  }, [
    router,
    recipeData.uuid,
    recipeName,
    description,
    images,
    components,
    dispatch,
  ]);

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 3 }}>
      <Card sx={{ padding: 4 }} onClick={stopPropagation}>
        <TextField
          key="NameTextField"
          fullWidth
          label={"Name"}
          value={recipeName}
          id="name"
          variant="standard"
          margin="none"
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setRecipeName(event.target.value)
          }
        />
        <TextField
          key="DescriptionTextField"
          fullWidth
          label={"Description"}
          value={description}
          id="name"
          variant="standard"
          margin="none"
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(event.target.value)
          }
        />
        <UploadDisplayImages images={images} setImages={setImages} />
        {components.map(({ uuid, value: component }, index) => (
          <ComponentForm
            key={uuid}
            component={component}
            index={index}
            save={replaceIndex}
            delete={deleteIndex}
            noName={components.length === 1}
          />
        ))}
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 0.5 }} />
          <Button onClick={() => insertIndex()} startIcon={<AddIcon />}>
            Add new section
          </Button>
          <div style={{ flexGrow: 0.5 }} />
        </div>
        <ExitSaveButtons
          saveOnClick={dispatchRecipe}
          exitOnClick={() => router.push("/food/recipes")}
          saveDisabled={false}
          buttonSx={{ flexGrow: 0.4 }}
          boxSx={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "10px",
          }}
        />
        {formAlert && (
          <Alert
            sx={{ mt: 2 }}
            severity="error"
            onClose={() => setFormAlert(null)}
          >
            {formAlert}
          </Alert>
        )}
      </Card>
    </Container>
  );
};

interface IComponentFormProps {
  component: IRecipeComponent;
  noName: boolean;
  save: (index: number, component: IRecipeComponent) => void;
  index: number;
  delete: (index: number) => void;
}

const ComponentForm = (props: IComponentFormProps) => {
  const { component, save, index } = props;

  const [name, setName] = useState(component.name);
  const {
    deleteIndex: deleteIndexInstruction,
    insertIndex: insertIndexInstruction,
    replaceIndex: replaceIndexInstruction,
    cards: instructions,
  } = useCardsWithIds({
    initialCards:
      component.instructions.length > 0
        ? component.instructions
        : [{ text: "", optional: false }],
    generateValue: () => ({
      text: "",
      optional: false,
    }),
  });
  const {
    deleteIndex: deleteIndexIngredient,
    insertIndex: insertIndexIngredient,
    replaceIndex: replaceIndexIngredient,
    cards: ingredients,
  } = useCardsWithIds({
    initialCards:
      component.ingredients.length > 0
        ? component.ingredients
        : [{ name: "", quantity: { unit: Unit.GRAM } }],
    generateValue: (): IRecipeIngredient => ({
      name: "",
      quantity: {},
    }),
  });
  const [storeable, setters] = useBoolean(component.storeable ?? false);
  const [servings, setServings] = useState(
    !!component.servings ? `${component.servings}` : "1"
  );

  const saveData = useCallback(() => {
    const intServings = parseInt(servings, 10);

    const componentState = {
      name,
      ingredients: ingredients.map((ingredient) => ingredient.value),
      instructions: instructions.map((instruction) => instruction.value),
      storeable,
      servings: isNaN(intServings) ? 1 : intServings,
    };
    save(index, componentState);
  }, [name, ingredients, instructions, storeable, save, index, servings]);

  const nameTextField = (
    <>
      <TextField
        key="MethodTextField"
        fullWidth
        value={name}
        id="name"
        variant="standard"
        margin="none"
        onClick={stopPropagation}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          setName(event.target.value)
        }
      />
      <div style={{ flexGrow: 1 }} />
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          props.delete(index);
        }}
        size="small"
        sx={{ alignSelf: "center" }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </>
  );

  const inputs = (
    <>
      <List
        subheader={<ListSubheader component="div">Ingredients</ListSubheader>}
      >
        <TableContainer component={"div"}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
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
              {ingredients.map(({ value: ingredient, uuid }, index) => (
                <TableRow key={uuid} sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left">
                    <TextField
                      fullWidth
                      value={ingredient.name}
                      id="ingredient"
                      variant="standard"
                      margin="none"
                      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                        replaceIndexIngredient(index, {
                          name: event.target.value,
                        });
                      }}
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
                          replaceIndexIngredient(index, {
                            quantity: {
                              unit: event.target.value as Unit,
                              value: ingredient.quantity.value,
                            },
                          });
                        }}
                        label="Unit"
                        sx={{ width: "90px" }}
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
                        replaceIndexIngredient(index, {
                          quantity: {
                            unit: ingredient.quantity.unit,
                            // TODO: This is not a number, really need better form inputs
                            value: event.target.value as unknown as number,
                          },
                        });
                      }}
                      sx={{ width: "50px" }}
                      disabled={ingredient.quantity.unit === Unit.NO_UNIT}
                    />
                  </TableCell>
                  <TableCell align="right" size="small">
                    <IconButton
                      onClick={() => deleteIndexIngredient(index)}
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
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 0.5 }} />
          <Button
            onClick={() => insertIndexIngredient()}
            startIcon={<AddIcon />}
            disabled={
              ingredients.length > 0 &&
              ingredients[ingredients.length - 1].value.name === ""
            }
          >
            New ingredient
          </Button>
          <div style={{ flexGrow: 0.5 }} />
        </div>
      </List>
      <Divider sx={{ pt: 1, pb: 1 }} />
      <FormControl sx={{ pt: 1 }}>
        <Tooltip title="Can it last in the cupboard, or freezer">
          <FormControlLabel
            control={
              <Checkbox
                checked={storeable}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setters.setState(event.target.checked)
                }
              />
            }
            label="Storeable"
          />
        </Tooltip>
        <TextField
          label="Servings"
          value={servings}
          id="instruction"
          variant="standard"
          type="number"
          margin="none"
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            setServings(event.target.value);
          }}
          sx={{ width: "100px" }}
        />
      </FormControl>
      <Divider sx={{ pt: 1, pb: 1 }} />

      <List subheader={<ListSubheader component="div">Method</ListSubheader>}>
        {instructions.map(({ value: instruction, uuid }, index) => (
          <ListItem key={uuid} disablePadding>
            <ListItemText primary={`${index + 1}.`} sx={{ paddingRight: 1 }} />
            <TextField
              fullWidth
              value={instruction.text}
              id="instruction"
              variant="standard"
              margin="none"
              multiline
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                replaceIndexInstruction(index, { text: event.target.value });
              }}
            />
            <IconButton
              onClick={() => deleteIndexInstruction(index)}
              size="small"
              sx={{ alignSelf: "center" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 0.5 }} />
          <Button
            onClick={() => insertIndexInstruction()}
            startIcon={<AddIcon />}
            disabled={
              instructions.length > 0 &&
              instructions[instructions.length - 1].value.text === ""
            }
          >
            Add instruction
          </Button>
          <div style={{ flexGrow: 0.5 }} />
        </div>
      </List>
    </>
  );

  if (props.noName) {
    return (
      <Paper sx={{ p: 1 }} onMouseLeave={saveData}>
        {inputs}
      </Paper>
    );
  }

  return (
    <Accordion onMouseLeave={saveData}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {nameTextField}
      </AccordionSummary>
      <AccordionDetails>{inputs}</AccordionDetails>
    </Accordion>
  );
};

export default EditUploadRecipe;
