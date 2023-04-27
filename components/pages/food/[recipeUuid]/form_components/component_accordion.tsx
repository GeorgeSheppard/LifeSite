import { UseFormReturn, useFieldArray } from "react-hook-form";
import { IRecipe } from "../../../../../core/types/recipes";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormComponentName } from "./component_name";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AccordionDetails from "@mui/material/AccordionDetails";
import Divider from "@mui/material/Divider";
import { IngredientsList } from "./component_ingredients";
import { InstructionsList } from "./component_instructions_list";
import { FormServings } from "./component_servings";
import { FormStoreable } from "./component_storeable";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from 'uuid';

export const getDefaultComponent = () => ({
  uuid: uuidv4(),
  name: "",
  ingredients: [],
  instructions: [],
  storeable: false,
  servings: 1,
});

export const ComponentAccordions = ({
  form,
}: {
  form: UseFormReturn<IRecipe>;
}) => {
  const { control } = form;
  const { fields, remove, append } = useFieldArray({
    control,
    name: "components",
    rules: {
      minLength: 1,
      required: "At least one recipe component is required",
    },
  });

  return (
    <>
      {fields.map((field, index) => {
        return (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <FormComponentName form={form} id={field.id} index={index} />
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
              <IngredientsList index={index} form={form} />
              <Divider textAlign="center" sx={{ pt: 5, pb: 1 }}>
                Instructions
              </Divider>
              <InstructionsList index={index} form={form} />
              <Divider textAlign="center" sx={{ pt: 5, pb: 1 }}>
                Optional
              </Divider>
              <FormControl
                sx={{ pt: 1, flexDirection: "row", alignItems: "end" }}
              >
                <FormServings form={form} index={index} />
                <FormStoreable form={form} index={index} />
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
    </>
  );
};
