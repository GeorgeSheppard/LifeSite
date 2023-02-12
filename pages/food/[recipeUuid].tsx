import { useRouter } from "next/router";
import { useState, MouseEvent } from "react";
import { useMutateAndStore } from "../../components/hooks/user_data";
import { useRecipes } from "../../components/hooks/use_data";
import { v4 as uuidv4 } from "uuid";
import { addOrUpdateRecipe } from "../../store/reducers/food/recipes/recipes";
import {
  Control,
  useFieldArray,
  useForm,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import {
  IRecipe,
  RecipeUuid,
  Unit,
} from "../../store/reducers/food/recipes/types";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { AccordionDetails, Button, TextField } from "@mui/material";
import { ExitSaveButtons } from "../../components/core/exit_save_buttons";
import { UploadDisplayImages } from "../../components/cards/upload_and_display_images";
import LinearProgress from "@mui/material/LinearProgress";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function RecipeForm() {
  const router = useRouter();
  const uuid = router.query.recipeUuid as RecipeUuid | undefined;
  const recipe = useRecipes();
  if (recipe.isError) {
    console.error("Error: ", recipe.error);
    router.push("/food");
  }

  if (recipe.isLoading || !uuid) {
    return <LinearProgress />;
  }

  const recipeData = recipe.data[uuid] ?? {
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
        uuid: uuidv4(),
      },
    ],
  };

  return <FormWithData recipe={recipeData} />;
}

export const FormWithData = ({ recipe }: { recipe: IRecipe }) => {
  const { mutateAsync } = useMutateAndStore(addOrUpdateRecipe);
  const { register, handleSubmit, control, watch } = useForm<IRecipe>({
    defaultValues: recipe,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
  });
  const [images, setImages] = useState(recipe.images);

  const onSubmit = (data: IRecipe) => console.log(data);

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 3 }}>
      <Card
        sx={{ padding: 4 }}
        onClick={(event: MouseEvent<HTMLElement>) => {
          event.stopPropagation();
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            key="NameTextField"
            fullWidth
            label="Name"
            variant="standard"
            margin="none"
            {...register("name")}
          />
          <TextField
            key="DescriptionTextField"
            fullWidth
            label="Description"
            variant="standard"
            margin="none"
            sx={{ mt: 2 }}
            {...register("description")}
          />
          <UploadDisplayImages images={images} setImages={setImages} />
          {fields.map((field, index) => {
            return (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <TextField
                    key={`Name:${field.id}`}
                    fullWidth
                    label="Name"
                    variant="standard"
                    margin="none"
                    {...register(`components.${index}.name`)}
                  />
                  <div style={{ flexGrow: 1 }} />
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      remove(index);
                    }}
                    size="small"
                    sx={{ alignSelf: "center" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider textAlign="center">Ingredients</Divider>
                  <IngredientsList
                    index={index}
                    control={control}
                    register={register}
                    watch={watch}
                  />
                  <Divider textAlign="center" sx={{ pt: 5, pb: 1 }}>
                    Instructions
                  </Divider>
                  <InstructionsList
                    index={index}
                    control={control}
                    register={register}
                  />
                  <Divider textAlign="center" sx={{ pt: 5, pb: 1 }}>
                    Optional
                  </Divider>
                  <FormControl
                    sx={{ pt: 1, flexDirection: "row", alignItems: "end" }}
                  >
                    <TextField
                      label="Servings"
                      variant="standard"
                      type="number"
                      margin="none"
                      sx={{ width: "100px" }}
                      {...register(`components.${index}.servings`, {
                        valueAsNumber: true,
                      })}
                    />
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
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            );
          })}
          <Button
            className="center p8"
            sx={{ mt: 2, mb: 3 }}
            onClick={() =>
              append({
                uuid: uuidv4(),
                name: "",
                ingredients: [],
                instructions: [],
                storeable: false,
              })
            }
            startIcon={<AddIcon />}
          >
            Add new section
          </Button>
          <ExitSaveButtons exitOnClick={() => {}} saveOnClick={() => {}} />
        </form>
      </Card>
    </Container>
  );
};

export const IngredientsList = ({
  register,
  index,
  control,
  watch,
}: {
  register: UseFormRegister<IRecipe>;
  index: number;
  control: Control<IRecipe>;
  watch: UseFormWatch<IRecipe>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `components.${index}.ingredients`,
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
                  <TextField
                    fullWidth
                    variant="standard"
                    margin="none"
                    {...register(
                      `components.${index}.ingredients.${ingredientIndex}.name`
                    )}
                  />
                </TableCell>
                <TableCell width="120px" align="left" size="small">
                  <FormControl variant="standard">
                    <Select
                      margin="none"
                      label="Unit"
                      {...register(
                        `components.${index}.ingredients.${ingredientIndex}.quantity.unit`
                      )}
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
                <TableCell width="110px" align="left" size="small">
                  <TextField
                    variant="standard"
                    margin="none"
                    {...register(
                      `components.${index}.ingredients.${ingredientIndex}.quantity.value`,
                      { valueAsNumber: true }
                    )}
                    disabled={
                      watch(
                        `components.${index}.ingredients.${ingredientIndex}.quantity.unit`
                      ) === Unit.NO_UNIT
                    }
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
      <Button
        className="center p8"
        sx={{ mt: 3 }}
        onClick={() => append({ name: "", quantity: { unit: Unit.GRAM } })}
        startIcon={<AddIcon />}
      >
        New ingredient
      </Button>
    </>
  );
};

export const InstructionsList = ({
  register,
  index,
  control,
}: {
  register: UseFormRegister<IRecipe>;
  index: number;
  control: Control<IRecipe>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `components.${index}.instructions`,
  });

  return (
    <>
      {fields.map((field, instructionIndex) => {
        return (
          <ListItem key={field.id} disablePadding>
            <ListItemText
              primary={`${instructionIndex + 1}.`}
              sx={{ paddingRight: 1 }}
            />
            <TextField
              fullWidth
              variant="standard"
              margin="none"
              multiline
              {...register(
                `components.${index}.instructions.${instructionIndex}.text`
              )}
            />
            <IconButton
              onClick={() => remove(instructionIndex)}
              size="small"
              sx={{ alignSelf: "center", ml: 2, width: "70px" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ListItem>
        );
      })}
      <Button
        className="center p8"
        onClick={() => append({ text: "" })}
        startIcon={<AddIcon />}
      >
        Add instruction
      </Button>
    </>
  );
};
