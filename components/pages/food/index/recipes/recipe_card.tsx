import InventoryIcon from "@mui/icons-material/Inventory";
import { Divider } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  useRecipe,
} from "../../../../../core/dynamo/hooks/use_dynamo_get";
import { IRecipe } from "../../../../../core/types/recipes";
import { WrappedCardMedia } from "../../../../core/cards/wrapped_card_media";
import { CopyIngredientsButton } from "./card_components/copy_ingredients";
import { CopyShareableLink } from "./card_components/copy_shareable_link";
import { DeleteRecipeButton } from "./card_components/delete_recipe";
import { DownloadSharedRecipe } from "./card_components/download_shared_recipe";
import { EditRecipeButton } from "./card_components/edit_recipe";
import { IngredientsList } from "./card_components/ingredients_list";
import { InstructionsList } from "./card_components/instructions_list";
import { OptionsDropdownButton } from "./card_components/options_dropdown";
import { ServingsIcon } from "./card_components/servings_icon";
import { WithDeleteDialog } from "./card_components/with_delete_dialog";
import { Dispatch, SetStateAction, memo } from "react";
import { FullRecipe } from "./recipe_grid";
import { trpc } from "../../../../../client";

export interface IRecipeCard {
  openDeleteDialog?: () => void;
  openFullRecipe?: Dispatch<SetStateAction<FullRecipe | null>>;
  isPreview: boolean
}

export const RecipeCard = (
  props: Omit<IRecipeCard, "openDeleteDialog"> & { fullRecipe: FullRecipe }
) => {
  const { fullRecipe } = props;

  const sharedRecipe = trpc.recipes.getSharedRecipe.useQuery(
    { share: props.fullRecipe.id },
    { enabled: props.fullRecipe.type === "Shared" }
  );
  const ownedRecipe = useRecipe(
    props.fullRecipe.id,
    props.fullRecipe.type === "Owned"
  );

  if (fullRecipe.type === "Shared") {
    return (
      <RecipeCardContent
        isPreview={props.isPreview}
        recipe={sharedRecipe.data}
        shared
      />
    );
  }

  return (
    <WithDeleteDialog
      uuid={fullRecipe.id}
      onDelete={() => props.openFullRecipe?.(null)}
    >
      {(openDeleteDialog) => (
        <RecipeCardContent
          isPreview={props.isPreview}
          openDeleteDialog={openDeleteDialog}
          openFullRecipe={() => {
            const uuid = ownedRecipe.data?.uuid
            if (!!uuid) props.openFullRecipe?.({ id: uuid, type: "Owned" })
          }}
          shared={false}
          recipe={ownedRecipe.data}
        />
      )}
    </WithDeleteDialog>
  );
};

const RecipeCardContent = memo(function MemoRecipeCardContent(
  props: Omit<IRecipeCard, "openFullRecipe"> & { shared: boolean; recipe?: IRecipe, openFullRecipe?: () => void }
) {
  const { recipe, shared } = props;
  if (!recipe) return null;

  return (
    <div
      onClick={() => {
        props.openFullRecipe?.();
      }}
      className="hover:shadow-xl drop-shadow-[0_0px_3px_rgba(0,0,0,0.25)] ease-in duration-200 flex-grow hover:cursor-pointer rounded-lg overflow-hidden"
    >
      {recipe.images && (
        <WrappedCardMedia
          images={recipe.images}
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
          {shared && <DownloadSharedRecipe recipe={recipe} />}
          {!shared && (
            <>
              <OptionsDropdownButton uuid={recipe.uuid}>
                <CopyShareableLink recipe={recipe} />
                <CopyIngredientsButton recipe={recipe} />
                <EditRecipeButton uuid={recipe.uuid} />
                <DeleteRecipeButton onClick={props.openDeleteDialog!} />
              </OptionsDropdownButton>
            </>
          )}
        </div>
        <div className="m-2 space-y-2">
          {recipe.components.map((component) => (
            <>
              <div key={component.name} className="flex flex-row">
                <Typography
                  variant="subtitle2"
                  className="grow my-auto"
                  color="#717171"
                >
                  {component.name}
                </Typography>
                {!props.isPreview && (
                  <div className="flex my-auto space-x-2">
                    {component.servings && (
                      <ServingsIcon servings={component.servings} />
                    )}
                    <Tooltip
                      title={
                        component.storeable
                          ? "Can be stored"
                          : "Can't be stored"
                      }
                    >
                      <InventoryIcon
                        fontSize="small"
                        htmlColor="#212121"
                        className={`block m-auto ${
                          component.storeable ? "opacity-100" : "opacity-20"
                        }`}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
              {!props.isPreview && (
                <div className="ml-4 space-y-3">
                  <IngredientsList ingredients={component.ingredients} />
                  {component.instructions.length > 0 && (
                    <InstructionsList instructions={component.instructions} />
                  )}
                </div>
              )}
            </>
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
});
