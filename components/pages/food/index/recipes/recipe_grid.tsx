import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import Masonry from "react-masonry-css";
import { RecipeUuid } from "../../../../../core/types/recipes";
import { CreateNewRecipeCard } from "./card_components/create_new_recipe";
import { LoadingRecipeCard } from "./card_components/loading_skeleton";
import { WithDragging } from "./card_components/with_dragging";
import { RecipeCard } from "./recipe_card";
import { PreviewRecipe } from "../../../../../pages/food";
import { useOneTimeEffect } from "../../../../../core/hooks/use_one_time_effect";

interface RecipeGridProps {
  searchResults: { uuid: RecipeUuid; visible: boolean }[];
  loading: boolean;
  previewRecipe?: PreviewRecipe;
}

export const RecipeGrid = (props: RecipeGridProps) => {
  const [fullRecipe, setFullRecipe] = useState<PreviewRecipe | null>(null);
  useOneTimeEffect(
    () => setFullRecipe(props.previewRecipe!),
    () => !!props.previewRecipe
  );

  const breakpoints = {
    default: 4,
    600: 1,
    900: 2,
    1200: 3,
    1536: 3,
  };

  return (
    <>
      <Dialog
        open={!!fullRecipe}
        onClose={() => setFullRecipe(null)}
        fullWidth
        PaperProps={{ className: "bg-transparent max-w-lg" }}
      >
        {fullRecipe && (
          <RecipeCard
            uuid={fullRecipe.recipe}
            user={fullRecipe.user}
            visible
            isPreview={false}
            onDelete={() => setFullRecipe(null)}
          />
        )}
      </Dialog>
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <CreateNewRecipeCard />
        {props.searchResults.map(({ uuid, visible }) => (
          <WithDragging key={uuid} uuid={uuid}>
            <RecipeCard
              uuid={uuid}
              visible={visible}
              onClick={() => setFullRecipe({ recipe: uuid })}
              isPreview
            />
          </WithDragging>
        ))}
        {props.loading &&
          Array.from(Array(15)).map((_, index) => {
            return <LoadingRecipeCard key={index} />;
          })}
      </Masonry>
    </>
  );
};
