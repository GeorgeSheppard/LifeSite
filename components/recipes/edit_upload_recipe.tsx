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
import { stopPropagation } from "../cards/utilities";
import TextField from "@mui/material/TextField";
import { UploadDisplayImages } from "../cards/upload_and_display_images";
import {
  AccordionDetails,
  IconButton,
  List,
  ListItemText,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import { ExitSaveButtons } from "../cards/exit_save_buttons";
import { useCardsWithIds } from "../hooks/use_cards";
import { Unit } from "../../store/reducers/food/units";
import { useBoolean } from "../hooks/use_boolean";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Quantities } from "../../store/reducers/food/units";

export interface IEditUploadRecipeProps {
  /**
   * New recipe will have a uuid but no data in store
   */
  uuid: RecipeUuid;
  closeBackdrop: () => void;
}

export const EditUploadRecipe = (props: IEditUploadRecipeProps) => {
  const [uuid] = useState<RecipeUuid>(props.uuid);
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

  const dispatchRecipe = useCallback(() => {
    const close = props.closeBackdrop;

    dispatch(
      addOrUpdateRecipe({
        uuid: recipeData.uuid,
        name: recipeName,
        description,
        images,
        components: components.map((component) => component.value),
      })
    );
    close();
  }, [
    props.closeBackdrop,
    recipeData.uuid,
    recipeName,
    description,
    images,
    components,
    dispatch,
  ]);

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Grid container alignItems="center" justifyContent="center">
        <Grid item key="edit_upload" xs={12} sm={6} md={8}>
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
              <IconButton onClick={() => insertIndex()}>
                <AddIcon />
              </IconButton>
              <div style={{ flexGrow: 0.5 }} />
            </div>
            <ExitSaveButtons
              saveOnClick={dispatchRecipe}
              exitOnClick={props.closeBackdrop}
              saveDisabled={false}
              buttonSx={{ flexGrow: 0.4 }}
              boxSx={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "10px",
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export interface IComponentFormProps {
  component: IRecipeComponent;
  noName: boolean;
  save: (index: number, component: IRecipeComponent) => void;
  index: number;
  delete: (index: number) => void;
}

export const ComponentForm = (props: IComponentFormProps) => {
  const { component, save, index } = props;

  const [name, setName] = useState(component.name);
  const {
    deleteIndex: deleteIndexInstruction,
    insertIndex: insertIndexInstruction,
    replaceIndex: replaceIndexInstruction,
    cards: instructions,
  } = useCardsWithIds({
    initialCards: component.instructions,
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
    initialCards: component.ingredients,
    generateValue: (): IRecipeIngredient => ({
      name: "",
      quantity: {},
    }),
  });
  const [storeable, setters] = useBoolean(component.storeable ?? false);
  const [servings, setServings] = useState(!!component.servings ? `${component.servings}` : "1");

  const saveData = useCallback(() => {
    const intServings = parseInt(servings, 10);

    const componentState = {
      name,
      ingredients: ingredients.map((ingredient) => ingredient.value),
      instructions: instructions.map((instruction) => instruction.value),
      storeable,
      servings: isNaN(intServings) ? 1 : intServings
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
    <List>
      {ingredients.map(({ value: ingredient, uuid }, index) => (
        <ListItem key={uuid} disablePadding>
          <ListItemText primary={`${index + 1}.`} sx={{ paddingRight: 1 }} />
          <TextField
            fullWidth
            value={ingredient.name}
            id="ingredient"
            variant="standard"
            margin="none"
            multiline
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              replaceIndexIngredient(index, { name: event.target.value });
            }}
          />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Unit</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={ingredient.quantity.unit}
              onChange={(event: SelectChangeEvent) => {
                replaceIndexIngredient(index, {
                  quantity: {
                    unit: event.target.value as Unit,
                    value: ingredient.quantity.value,
                  },
                });
              }}
              label="Unit"
            >
              {Object.entries(Unit).map((value) => {
                return (
                  <MenuItem key={value[0]} value={value[1]}>
                    {value[1]}
                  </MenuItem>
                );
              })}
            </Select>
            {ingredient.quantity.unit &&
              ingredient.quantity.unit !== Unit.NO_UNIT && (
                <TextField
                  fullWidth
                  value={ingredient.quantity.value}
                  id="ingredient quantity"
                  variant="standard"
                  margin="none"
                  multiline
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    replaceIndexIngredient(index, {
                      quantity: {
                        unit: ingredient.quantity.unit,
                        value: parseFloat(event.target.value),
                      },
                    });
                  }}
                />
              )}
          </FormControl>
          <IconButton
            onClick={() => deleteIndexIngredient(index)}
            size="small"
            sx={{ alignSelf: "center" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </ListItem>
      ))}
            <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 0.5 }} />
        <IconButton
          onClick={() => {
            if (
              ingredients.length === 0 ||
              ingredients[ingredients.length - 1].value.name !== ""
            ) {
              insertIndexIngredient();
            }
          }}
        >
          <AddIcon />
        </IconButton>
        <div style={{ flexGrow: 0.5 }} />
      </div>
      <FormGroup>
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
      </FormGroup>
      <TextField
        fullWidth
        label="Servings"
        value={servings}
        id="instruction"
        variant="standard"
        type="number"
        margin="none"
        multiline
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setServings(event.target.value)
        }}
      />
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
        <IconButton
          onClick={() => {
            if (
              instructions.length === 0 ||
              instructions[instructions.length - 1].value.text !== ""
            ) {
              insertIndexInstruction();
            }
          }}
        >
          <AddIcon />
        </IconButton>
        <div style={{ flexGrow: 0.5 }} />
      </div>
    </List>
  );

  if (props.noName) {
    return inputs;
  }

  return (
    <Accordion onBlur={saveData}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {nameTextField}
      </AccordionSummary>
      <AccordionDetails>{inputs}</AccordionDetails>
    </Accordion>
  );
};
