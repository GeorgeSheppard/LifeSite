import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import { Divider, IconButton } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { NextRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useDrag } from "react-dnd";
import { deleteRecipe } from "../../store/reducers/food/recipes/recipes";
import {
  IRecipe,
  IRecipeComponent,
  RecipeUuid,
} from "../../store/reducers/food/recipes/types";
import { Quantities } from "../../store/reducers/food/units";
import { WrappedCardMedia } from "../cards/wrapped_card_media";
import { IUseBooleanCallbacks, useBoolean } from "../hooks/use_boolean";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useRecipes } from "../hooks/use_data";
import { useMutateAndStore } from "../hooks/user_data";

export interface IRecipeCardWithDialogProps {
  uuid: RecipeUuid;
  router: NextRouter;
  visible: boolean;
  withIcons?: boolean;
}

export const RecipeCardWithDialog = (props: IRecipeCardWithDialogProps) => {
  const { uuid, router } = props;
  const { mutate } = useMutateAndStore(deleteRecipe);
  const recipe = useRecipes().data[uuid];
  const [dialogOpen, setters] = useBoolean(false);

  const deleteRecipeOnClick = useCallback(() => {
    mutate(uuid);
  }, [uuid, mutate]);

  if (!recipe) {
    return null;
  }

  return (
    <>
      <Dialog open={dialogOpen} onClose={setters.turnOff}>
        <DialogTitle>{"Delete this recipe?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recipe? This may affect your
            meal plan and this action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setters.turnOff}>{"No, cancel"}</Button>
          <Button onClick={deleteRecipeOnClick} autoFocus color="error">
            {"Yes, I'm sure"}
          </Button>
        </DialogActions>
      </Dialog>
      <RecipeCard
        router={router}
        recipe={recipe}
        uuid={uuid}
        visible={props.visible}
        setters={setters}
        withIcons={props.withIcons}
      />
    </>
  );
};

export interface IRecipeCard {
  router: NextRouter;
  recipe: IRecipe;
  uuid: RecipeUuid;
  visible: boolean;
  setters: IUseBooleanCallbacks;
  withIcons?: boolean;
}

export const RecipeCard = (props: IRecipeCard) => {
  const { recipe, router, uuid, setters, withIcons } = props;

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "recipe",
    item: { uuid },
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
  }));

  const onEdit = useCallback(() => {
    router.push(`/food/${uuid}`);
  }, [router, uuid]);

  const headerChildren = useMemo(() => {
    const turnOn = setters.turnOn;

    return (
      <>
        <Typography fontSize={24} fontWeight={400}>
          {recipe?.name}
        </Typography>
        {(withIcons ?? true) && (
          <>
            <div style={{ flexGrow: 1, paddingRight: 2 }} />
            <div style={{ paddingLeft: 2 }} />
            <Tooltip title="Copy ingredients">
              <IconButton
                onClick={(event) => {
                  event?.stopPropagation();
                  const ingredients = recipe.components.flatMap(
                    (component) => component.ingredients
                  );
                  const text = ingredients
                    .map((ingredient) =>
                      Quantities.toStringWithIngredient(
                        ingredient.name,
                        ingredient.quantity
                      )
                    )
                    .join("\n");
                  navigator.clipboard.writeText(text);
                }}
                size="small"
                sx={{ alignSelf: "center", mr: 1 }}
              >
                <ContentCopyIcon fontSize="small" htmlColor="#212121" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                onClick={(event) => {
                  event?.stopPropagation();
                  onEdit();
                }}
                size="small"
                sx={{ alignSelf: "center", mr: 1 }}
              >
                <EditIcon fontSize="small" htmlColor="#212121" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={(event) => {
                  event?.stopPropagation();
                  turnOn();
                }}
                size="small"
                sx={{ alignSelf: "center", mr: 1 }}
              >
                <DeleteIcon fontSize="small" htmlColor="#7d2020" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    );
  }, [recipe?.name, onEdit, setters.turnOn, recipe.components, withIcons]);

  return (
    <Card
      className="cardWithHover"
      sx={{ opacity: !props.visible ? 0 : isDragging ? 0.5 : 1 }}
      ref={drag}
    >
      {/* Remove the drag preview */}
      <div ref={preview} style={{ width: 0, height: 0 }} />
      {recipe.images && <WrappedCardMedia images={recipe.images} />}
      <Accordion key="name">
        <AccordionSummary
          expandIcon={
            recipe.description?.length > 0 && (
              <ExpandMoreIcon htmlColor="#212121" />
            )
          }
          sx={{ display: "flex" }}
        >
          {headerChildren}
        </AccordionSummary>
        {recipe.description?.length > 0 && (
          <AccordionDetails>
            <Typography>{recipe.description}</Typography>
          </AccordionDetails>
        )}
      </Accordion>
      {recipe.components.map((component) => (
        <ComponentContent key={component.name} component={component} />
      ))}
    </Card>
  );
};

export interface IComponentContentInstructionsMethod {
  component: IRecipeComponent;
}

const ComponentContentInstructionsMethod = (
  props: IComponentContentInstructionsMethod
) => {
  const { component } = props;

  return (
    <>
      {component.ingredients.length > 0 && (
        <>
          <ListItem key="ingredients" sx={{ pb: 2, pl: 1 }}>
            <ListItemText
              primary="Ingredients"
              primaryTypographyProps={{ fontSize: "16px", fontWeight: 550 }}
            />
          </ListItem>
          {component.ingredients.map(({ name, quantity }) => {
            return (
              <ListItem key={name} sx={{ p: 0, pl: 3 }}>
                <ListItemText
                  primary={
                    "- " + Quantities.toStringWithIngredient(name, quantity)
                  }
                />
              </ListItem>
            );
          })}
          {component.instructions.length > 0 && <Divider sx={{ pt: 5 }} />}
        </>
      )}
      {component.instructions.length > 0 && (
        <>
          <ListItem key="method" sx={{ pb: 2, pl: 1, pt: 5 }}>
            <ListItemText
              primary="Method"
              primaryTypographyProps={{ fontSize: "16px", fontWeight: 550 }}
            />
          </ListItem>
          {component.instructions.map(({ text, optional }, index) => {
            let visibleText = `${index + 1}. `;
            if (optional) {
              visibleText += "(Optional) ";
            }
            visibleText += text;
            return (
              <ListItem key={text} sx={{ p: 0, pl: 3 }}>
                <ListItemText primary={visibleText} />
              </ListItem>
            );
          })}
        </>
      )}
    </>
  );
};

export interface IComponentContentProps {
  component: IRecipeComponent;
}

const ComponentContent = (props: IComponentContentProps) => {
  const { component } = props;
  return (
    <Accordion key={component.name}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon htmlColor="#212121" />}
        sx={{ display: "flex" }}
      >
        <Typography>{component.name ?? "Optional"}</Typography>
        <div style={{ flexGrow: 1 }} />
        {component.servings && component.servings > 1 && (
          <Tooltip title={`Serves ${component.servings}`}>
            {/* div instead of fragment as tooltip doesn't work with fragment */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingRight: 6.5,
              }}
            >
              <Typography>{component.servings}</Typography>
              <PersonIcon sx={{ paddingRight: 0.5 }} />
            </div>
          </Tooltip>
        )}
        {component.storeable && (
          <Tooltip title="Can be stored">
            <InventoryIcon sx={{ paddingRight: 1, marginRight: 0.3 }} />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <List dense>
          <ComponentContentInstructionsMethod component={component} />
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
