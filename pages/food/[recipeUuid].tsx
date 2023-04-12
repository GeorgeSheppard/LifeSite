import { useRouter } from "next/router";
import { useState, MouseEvent } from "react";
import { useRecipe } from "../../components/hooks/user_data/use_dynamo";
import { v4 as uuidv4 } from "uuid";
import {
  Control,
  FieldErrors,
  useFieldArray,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  IRecipe,
  RecipeUuid,
  Unit,
} from "../../store/reducers/food/recipes/types";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { AccordionDetails, Alert, Button, TextField } from "@mui/material";
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
import { usePutRecipeToDynamo } from "../../components/hooks/user_data/use_dynamo_put";

const getDefaultRecipe = (uuid: string) => ({
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
      servings: 1,
    },
  ],
});
const getDefaultComponent = () => ({
  uuid: uuidv4(),
  name: "",
  ingredients: [],
  instructions: [],
  storeable: false,
  servings: 1,
});
const getDefaultIngredient = () => ({
  name: "",
  quantity: { unit: Unit.GRAM },
});
const getDefaultInstruction = () => ({
  text: "",
});

export const NewRecipe = "newRecipe"

export default function RecipeForm() {
  const router = useRouter();
  const uuid = router.query.recipeUuid as RecipeUuid | undefined;
  const recipe = useRecipe(uuid ?? "");
  if (!uuid) {
    return <LinearProgress />
  }
  if (uuid === NewRecipe) {
    return <FormWithData recipe={getDefaultRecipe(uuidv4())} />
  }
  if (recipe.isError) {
    console.error("Error: ", recipe.error);
    router.push("/food");
    return;
  }

  if (recipe.isLoading) {
    return <LinearProgress />;
  }

  return <FormWithData recipe={recipe.data} />;
}

export const FormWithData = ({ recipe }: { recipe: IRecipe }) => {
  const router = useRouter();
  const { mutateAsync, disabled } = usePutRecipeToDynamo()
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<IRecipe>({
    defaultValues: recipe,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
    rules: {
      minLength: 1,
      required: "At least one recipe component is required",
    },
  });
  const [images, setImages] = useState(recipe.images);

  const onSubmit = async (data: IRecipe) => {
    data.images = images;
    await mutateAsync(data);
    router.push("/food");
  };

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
            {...register("name", {
              required: "A recipe name is required",
            })}
            error={!!errors.name}
            helperText={errors?.name?.message}
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
          {errors?.components?.root && (
            <Alert severity="error">{errors?.components.root.message}</Alert>
          )}
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
                    errors={errors}
                    setValue={setValue}
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
                        min: 1,
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
            onClick={() => append(getDefaultComponent())}
            startIcon={<AddIcon />}
          >
            Add new section
          </Button>
          <ExitSaveButtons
            saveDisabled={disabled}
            exitOnClick={() => router.push('/food')}
            // React hook form targets buttons with type="submit" so no handler is necessary
            saveOnClick={() => {}}
            boxSx={{ display: "flex", justifyContent: "space-between", pt: 1 }}
          />
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
  errors,
  setValue,
}: {
  register: UseFormRegister<IRecipe>;
  index: number;
  control: Control<IRecipe>;
  watch: UseFormWatch<IRecipe>;
  errors: FieldErrors<IRecipe>;
  setValue: UseFormSetValue<IRecipe>;
}) => {
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
                  <TextField
                    fullWidth
                    variant="standard"
                    margin="none"
                    {...register(
                      `components.${index}.ingredients.${ingredientIndex}.name`,
                      {
                        required: "The ingredient name is required",
                      }
                    )}
                    error={
                      !!errors?.components?.[index]?.ingredients?.[
                        ingredientIndex
                      ]?.name
                    }
                    helperText={
                      errors?.components?.[index]?.ingredients?.[
                        ingredientIndex
                      ]?.name?.message
                    }
                  />
                </TableCell>
                <TableCell width="120px" align="left" size="small">
                  <FormControl variant="standard">
                    <Select
                      margin="none"
                      label="Unit"
                      defaultValue={getDefaultIngredient().quantity.unit}
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
                        !!errors?.components?.[index]?.ingredients?.[
                          ingredientIndex
                        ]?.quantity?.unit
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
                </TableCell>
                <TableCell width="110px" align="left" size="small">
                  <TextField
                    variant="standard"
                    margin="none"
                    type="number"
                    {...register(
                      `components.${index}.ingredients.${ingredientIndex}.quantity.value`,
                      {
                        min: 0,
                        valueAsNumber: true,
                        validate: (value, formValues) =>
                          formValues.components[index].ingredients[
                            ingredientIndex
                          ].quantity.unit === Unit.NO_UNIT
                            ? !value || isNaN(value)
                            : !!value,
                      }
                    )}
                    error={
                      !!errors?.components?.[index]?.ingredients?.[
                        ingredientIndex
                      ]?.quantity?.value
                    }
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
        onClick={() => append(getDefaultInstruction())}
        startIcon={<AddIcon />}
      >
        Add instruction
      </Button>
    </>
  );
};
