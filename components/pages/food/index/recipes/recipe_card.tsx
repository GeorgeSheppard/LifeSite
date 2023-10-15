import { Divider } from "@mui/material";
import { useRecipe } from "../../../../../core/dynamo/hooks/use_dynamo_get";
import { IRecipe, RecipeUuid } from "../../../../../core/types/recipes";
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
import { RecipeContainer } from "./styling/RecipeContainer";
import { Storeable } from "./card_components/can_be_stored";
import { DescriptionContainer } from "./styling/DescriptionContainer";
import { RecipeContentContainer } from "./styling/RecipeContentContainer";
import { RecipeHeader } from "./styling/RecipeHeader";
import { RecipeBody } from "./styling/RecipeBody";
import { ComponentHeader } from "./styling/ComponentHeader";
import { ComponentBody } from "./styling/ComponentBody";
import { ComponentTitle } from "./styling/ComponentTitle";
import { Description } from "./styling/Description";
import { RecipeTitle } from "./styling/RecipeTitle";
import { FullRecipe } from "./recipe_grid";

export interface IRecipeCard {
  openFullRecipe: Dispatch<SetStateAction<FullRecipe | null>>;
  isPreview: boolean;
}

export const RecipeCardFromId = (props: IRecipeCard & { id: RecipeUuid }) => {
  const { id } = props;

  const recipe = useRecipe(id);

  return (
    <RecipeCard
      isPreview={props.isPreview}
      openFullRecipe={props.openFullRecipe}
      shared={false}
      recipe={recipe.data}
    />
  );
};

export const RecipeCard = memo(function MemoRecipeCardContent(
  props: IRecipeCard & {
    shared: boolean;
    recipe?: IRecipe;
  }
) {
  const { recipe, shared } = props;
  if (!recipe) return null;

  return (
    <WithDeleteDialog
      uuid={recipe.uuid}
      onDelete={() => props.openFullRecipe(null)}
    >
      {(openDeleteDialog) => (
        <RecipeContainer
          onClick={() => {
            if (props.isPreview) {
              props.openFullRecipe({ recipe, shared });
            }
          }}
        >
          {recipe.images && (
            <WrappedCardMedia
              images={recipe.images}
              mediaClassName="rounded-t-lg"
            />
          )}
          <RecipeContentContainer>
            <RecipeHeader>
              <RecipeTitle>{recipe?.name}</RecipeTitle>
              {shared && (
                <DownloadSharedRecipe
                  recipe={recipe}
                  onDownload={(recipe) =>
                    props.openFullRecipe({ recipe, shared: false })
                  }
                />
              )}
              {!shared && (
                <>
                  <OptionsDropdownButton uuid={recipe.uuid}>
                    <CopyShareableLink recipe={recipe} />
                    <CopyIngredientsButton recipe={recipe} />
                    <EditRecipeButton uuid={recipe.uuid} />
                    <DeleteRecipeButton onClick={openDeleteDialog!} />
                  </OptionsDropdownButton>
                </>
              )}
            </RecipeHeader>
            <RecipeBody>
              {recipe.components.map((component) => (
                <>
                  <ComponentHeader key={component.name}>
                    <ComponentTitle>{component.name}</ComponentTitle>
                    {!props.isPreview && (
                      <div className="flex my-auto space-x-2">
                        {component.servings && (
                          <ServingsIcon servings={component.servings} />
                        )}
                        <Storeable storeable={component.storeable} />
                      </div>
                    )}
                  </ComponentHeader>
                  {!props.isPreview && (
                    <ComponentBody>
                      <IngredientsList ingredients={component.ingredients} />
                      {component.instructions.length > 0 && (
                        <InstructionsList
                          instructions={component.instructions}
                        />
                      )}
                    </ComponentBody>
                  )}
                </>
              ))}
            </RecipeBody>
            {recipe.description?.length > 0 && (
              <DescriptionContainer>
                <Divider />
                <Description>{recipe.description}</Description>
              </DescriptionContainer>
            )}
          </RecipeContentContainer>
        </RecipeContainer>
      )}
    </WithDeleteDialog>
  );
});
