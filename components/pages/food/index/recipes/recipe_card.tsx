import { useRecipe } from "../../../../../core/dynamo/hooks/use_dynamo_get";
import { RecipeUuid } from "../../../../../core/types/recipes";
import { WrappedCardMedia } from "../../../../core/cards/wrapped_card_media";
import Typography from "@mui/material/Typography";
import { CopyIngredientsButton } from "./card_components/copy_ingredients";
import { EditRecipeButton } from "./card_components/edit_recipe";
import { DeleteRecipeButton } from "./card_components/delete_recipe";
import { ServingsIcon } from "./card_components/servings_icon";
import Tooltip from "@mui/material/Tooltip";
import InventoryIcon from "@mui/icons-material/Inventory";
import { OptionsDropdownButton } from "./card_components/options_dropdown";
import { Divider } from "@mui/material";
import { WithDeleteDialog } from "./card_components/with_delete_dialog";

export interface IRecipeCard {
  uuid: RecipeUuid;
  visible: boolean;
  openDialog: () => void;
  isPreview: boolean;
  onClick?: () => void;
}

export const RecipeCard = (
  props: Omit<IRecipeCard, "openDialog"> & {
    onDelete?: (uuid: RecipeUuid) => void;
  }
) => {
  return (
    <WithDeleteDialog uuid={props.uuid} onDelete={props.onDelete}>
      {(openDialog) => <RecipeCardContent {...props} openDialog={openDialog} />}
    </WithDeleteDialog>
  );
};

const RecipeCardContent = (props: IRecipeCard) => {
  const { uuid } = props;

  const recipe = useRecipe(uuid).data;

  if (!recipe) {
    return null;
  }

  return (
    <div
      onClick={props.onClick}
      className="hover:shadow-xl ease-in duration-200"
    >
      {recipe.images && (
        <WrappedCardMedia
          images={recipe.images}
          mediaClassName="rounded-t-lg"
        />
      )}
      <div className="flex-row p-3 space-y-3 shadow rounded-b-lg bg-white">
        <div className="flex">
          <Typography
            variant="subtitle1"
            className="grow my-auto font-[500]"
            color="#222222"
          >
            {recipe?.name}
          </Typography>
          <OptionsDropdownButton uuid={uuid}>
            <CopyIngredientsButton recipe={recipe} />
            <EditRecipeButton uuid={uuid} />
            <DeleteRecipeButton onClick={props.openDialog} />
          </OptionsDropdownButton>
        </div>
        <div className="m-2 space-y-2">
          {recipe.components.map((component) => (
            <div key={component.name} className="flex flex-row">
              <Typography
                variant="subtitle2"
                className="grow my-auto"
                color="#717171"
              >
                {component.name}
              </Typography>
              <div className="flex my-auto space-x-2">
                {component.servings && component.servings > 1 && (
                  <ServingsIcon servings={component.servings} />
                )}
                {component.storeable && (
                  <Tooltip title="Can be stored">
                    <InventoryIcon
                      fontSize="small"
                      htmlColor="#212121"
                      className="block m-auto"
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>
        {recipe.description?.length > 0 && (
          <div className="flex flex-col space-y-3">
            <Divider />
            <Typography variant="body2" fontSize={12}>
              {recipe.description}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
