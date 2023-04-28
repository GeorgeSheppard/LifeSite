import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

export interface IComponentAccordionProps {
  component: IRecipeComponent;
}

export const ComponentAccordion = (props: IComponentAccordionProps) => {
  const { component } = props;
  return (
    <Accordion key={component.name}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon htmlColor="#212121" />}
        sx={{ display: "flex" }}
      >
        <Typography variant="subtitle2">{component.name ?? "Optional"}</Typography>
        <div style={{ flexGrow: 1 }} />
        {component.servings && component.servings > 1 && (
          <ServingsIcon servings={component.servings} />
        )}
        {component.storeable && (
          <Tooltip title="Can be stored">
            <InventoryIcon sx={{ paddingRight: 1, marginRight: 0.3 }} />
          </Tooltip>
        )}
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
