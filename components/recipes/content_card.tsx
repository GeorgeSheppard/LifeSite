import { RecipeUuid } from "../../store/reducers/food/recipes";
import { useAppSelector } from "../../store/hooks/hooks";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { WrappedCardMedia } from "../cards/wrapped_card_media";
import InventoryIcon from "@mui/icons-material/Inventory";
import Tooltip from "@mui/material/Tooltip";
import CardHeader from "@mui/material/CardHeader";

export interface IRecipeCardProps {
  uuid: RecipeUuid;
}

export const RecipeCard = (props: IRecipeCardProps) => {
  const recipe = useAppSelector((store) => store.recipes.recipes[props.uuid]);

  return (
    <>
      {recipe.images && <WrappedCardMedia images={recipe.images} />}
      <Accordion key="ingredients">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <CardHeader title={recipe.name} />
        </AccordionSummary>
        <AccordionDetails>{recipe.description}</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Ingredients</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {recipe.method?.flatMap((method) => [
              <ListItem key={method.name} disablePadding>
                <ListItemText primary={method.name} />
              </ListItem>,
              method.recipe.ingredients.flatMap((ingredient) => (
                <ListItem key={ingredient.name}>
                  <ListItemText
                    primary={
                      "- " +
                      ingredient.quantity?.toStringWithIngredient(
                        ingredient.name
                      )
                    }
                  />
                </ListItem>
              )),
            ])}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Method</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          {recipe.method?.map((method) => {
            return (
              <Accordion key={method.name}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ display: "flex" }}
                >
                  <Typography>{method.name ?? "Extra"}</Typography>
                  {method.recipe.storeable && (
                    <>
                      <div style={{ flexGrow: 1 }} />
                      <Tooltip title="Can be stored">
                        <InventoryIcon sx={{ paddingRight: 1 }} />
                      </Tooltip>
                    </>
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {method.instructions?.map((instruction, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${index + 1}. ${instruction}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
