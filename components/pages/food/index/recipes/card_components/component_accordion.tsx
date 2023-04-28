import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import InventoryIcon from "@mui/icons-material/Inventory";
import { ServingsIcon } from "./servings_icon";
import Tooltip from "@mui/material/Tooltip";
import AccordionDetails from "@mui/material/AccordionDetails";
import List from "@mui/material/List";
import { IngredientsList } from "./ingredients_list";
import { InstructionsList } from "./instructions_list";
import Divider from "@mui/material/Divider";
import { IRecipeComponent } from "../../../../../../core/types/recipes";
import { IconButton } from "@mui/material";

export interface IComponentAccordionProps {
  component: IRecipeComponent;
}

export const ComponentAccordion = (props: IComponentAccordionProps) => {
  const { component } = props;
  return (
    <Accordion key={component.name}>
      <AccordionSummary className="flex justify-center">
        <Typography variant="subtitle2" className="grow my-auto">
          {component.name}
        </Typography>
        <div className="flex space-x-2">
          {component.servings && component.servings > 1 && (
            <IconButton size="small">
            <ServingsIcon servings={component.servings} />
            </IconButton>
          )}
          {component.storeable && (
            <Tooltip title="Can be stored">
              <IconButton size="small">
              <InventoryIcon fontSize="small" htmlColor="#212121" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <List dense>
          <IngredientsList ingredients={component.ingredients} />
          {component.instructions.length > 0 &&
            component.ingredients.length > 0 && <Divider sx={{ pt: 5 }} />}
          <InstructionsList instructions={component.instructions} />
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
