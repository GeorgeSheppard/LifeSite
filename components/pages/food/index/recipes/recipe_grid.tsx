import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import Masonry from "react-masonry-css";
import { RecipeUuid } from "../../../../../core/types/recipes";
import { CreateNewRecipeCard } from "./card_components/create_new_recipe";
import { LoadingRecipeCard } from "./card_components/loading_skeleton";
import { WithDragging } from "./card_components/with_dragging";
import { RecipeCard } from "./recipe_card";
import { useOneTimeEffect } from "../../../../../core/hooks/use_one_time_effect";
import { SharedRecipeId } from "../../../../../core/dynamo/dynamo_utilities";

interface RecipeGridProps {
  searchResults: RecipeUuid[];
  loading: boolean;
  sharedRecipe?: SharedRecipeId;
}

export type FullRecipe = { type: "Shared", id: SharedRecipeId } | { type: "Owned", id: RecipeUuid }

export const RecipeGrid = (props: RecipeGridProps) => {
  const [fullRecipe, setFullRecipe] = useState<FullRecipe | null>(null);
  useOneTimeEffect(
    () => setFullRecipe({ id: props.sharedRecipe!, type: "Shared" }),
    () => !!props.sharedRecipe
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
            fullRecipe={fullRecipe}
            isPreview={false}
          />
        )}
      </Dialog>
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <CreateNewRecipeCard />
        {props.searchResults.map(uuid => (
          <WithDragging key={uuid} uuid={uuid}>
            <RecipeCard
              fullRecipe={{ type: "Owned", id: uuid }}
              openFullRecipe={setFullRecipe}
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
