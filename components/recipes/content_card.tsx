import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InventoryIcon from "@mui/icons-material/Inventory";
import { IconButton } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../store/hooks/hooks";
import { deleteRecipe, RecipeUuid } from "../../store/reducers/food/recipes";
import { WrappedCardMedia } from "../cards/wrapped_card_media";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBoolean } from "../hooks/use_boolean";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export interface IRecipeCardProps {
  uuid: RecipeUuid;
  onEdit: () => void;
}

export const RecipeCard = (props: IRecipeCardProps) => {
  const dispatch = useDispatch();
  const recipe = useAppSelector((store) => store.recipes.recipes[props.uuid]);
  const [dialogOpen, setters] = useBoolean(false);

  const deleteRecipeOnClick = useCallback(() => {
    dispatch(deleteRecipe(props.uuid));
  }, [dispatch, props.uuid]);

  return (
    <>
      <Dialog open={dialogOpen} onClose={setters.turnOff}>
        <DialogTitle>{"Delete this recipe?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recipe? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setters.turnOff}>{"No, cancel"}</Button>
          <Button onClick={deleteRecipeOnClick} autoFocus>
            {"Yes, I'm sure"}
          </Button>
        </DialogActions>
      </Dialog>
      <Card className="card">
        {recipe.images && <WrappedCardMedia images={recipe.images} />}
        <Accordion key="name">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ display: "flex" }}
          >
            <Typography fontSize={24}>{recipe.name}</Typography>
            <div style={{ flexGrow: 1 }} />
            <IconButton
              onClick={(event) => {
                event?.stopPropagation();
                setters.turnOn();
              }}
              size="small"
              sx={{ alignSelf: "center" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={(event) => {
                event?.stopPropagation();
                props.onEdit();
              }}
              size="small"
              sx={{ alignSelf: "center" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>{recipe.description}</AccordionDetails>
        </Accordion>
        {recipe.method.map((method) => {
          return (
            <Accordion key={method.name}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ display: "flex" }}
              >
                <Typography>{method.name ?? "Optional"}</Typography>
                {method.storeable && (
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
                  <ListItem key="ingredients">
                    <ListItemText primary="Ingredients" />
                  </ListItem>
                  {method.ingredients.map((ingredient) => (
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
                  ))}
                  <div style={{ height: 20 }} />
                  <ListItem key="method">
                    <ListItemText primary="Method" />
                  </ListItem>
                  {method.instructions.map((instruction, index) => {
                    return (
                      <ListItem key={instruction}>
                        <ListItemText
                          primary={`${index + 1}. ${instruction}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Card>
    </>
  );
};
