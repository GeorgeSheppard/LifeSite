import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useDrag } from "react-dnd";
import { deleteRecipe } from "../../../../store/reducers/food/recipes/recipes";
import { RecipeUuid } from "../../../../store/reducers/food/recipes/types";
import { WrappedCardMedia } from "../../../cards/wrapped_card_media";
import { useRecipes } from "../../../hooks/use_data";
import { useMutateAndStore } from "../../../hooks/user_data";
import { CopyIngredientsButton } from "./copy_ingredients";
import { EditRecipeButton } from "./edit_recipe";
import { DeleteRecipeButton } from "./delete_recipe";
import { CustomDialog } from "../../../core/dialog";
import { ComponentAccordion } from "./component_accordion";
import { useIsMobileLayout } from "../hooks/is_mobile_layout";

export interface IRecipeCardWithDialogProps {
  uuid: RecipeUuid;
  visible: boolean;
}

export const RecipeCardWithDeleteDialog = (
  props: IRecipeCardWithDialogProps
) => {
  const { uuid } = props;
  const { mutate } = useMutateAndStore(deleteRecipe);
  const deleteRecipeOnClick = () => mutate(uuid);

  return (
    <CustomDialog
      title="Delete this recipe?"
      content="Are you sure you want to delete this recipe? This may affect your
    meal plan and this action cannot be undone."
      confirmMessage="Yes I'm sure"
      cancelMessage="No, cancel"
      confirmOnClick={deleteRecipeOnClick}
    >
      {(openDialog) => (
        <RecipeCard
          uuid={uuid}
          visible={props.visible}
          openDialog={openDialog}
        />
      )}
    </CustomDialog>
  );
};

export interface IRecipeCard {
  uuid: RecipeUuid;
  visible: boolean;
  openDialog: () => void;
}

export const RecipeCard = (props: IRecipeCard) => {
  const { uuid } = props;

  const recipe = useRecipes().data[uuid];

  const mobileLayout = useIsMobileLayout();
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "recipe",
    item: { uuid },
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
    canDrag: () => !mobileLayout,
  }));

  if (!recipe) {
    return null;
  }

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
          <Typography fontSize={24} fontWeight={400}>
            {recipe?.name}
          </Typography>
          <div style={{ flexGrow: 1, paddingRight: 2 }} />
          <div style={{ paddingLeft: 2 }} />
          <CopyIngredientsButton recipe={recipe} />
          <EditRecipeButton uuid={uuid} />
          <DeleteRecipeButton onClick={props.openDialog} />
        </AccordionSummary>
        {recipe.description?.length > 0 && (
          <AccordionDetails>
            <Typography>{recipe.description}</Typography>
          </AccordionDetails>
        )}
      </Accordion>
      {recipe.components.map((component) => (
        <ComponentAccordion key={component.name} component={component} />
      ))}
    </Card>
  );
};