import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import Masonry from "react-masonry-css";
import { IRecipe, RecipeUuid } from "../../../../../core/types/recipes";
import { CreateNewRecipeCard } from "./card_components/create_new_recipe";
import { LoadingRecipeCard } from "./card_components/loading_skeleton";
import { WithDragging } from "./card_components/with_dragging";
import { useOneTimeEffect } from "../../../../../core/hooks/use_one_time_effect";
import { RecipeCard, RecipeCardFromId } from "./recipe_card";

interface RecipeGridProps {
  searchResults: RecipeUuid[];
  loading: boolean;
  sharedRecipe?: IRecipe;
}

export type FullRecipe = { recipe: IRecipe, shared: boolean }

export const RecipeGrid = (props: RecipeGridProps) => {
  const [fullRecipe, setFullRecipe] = useState<FullRecipe | null>(null);
  useOneTimeEffect(
    () => setFullRecipe({ recipe: props.sharedRecipe!, shared: true }),
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
            recipe={fullRecipe.recipe}
            isPreview={false}
            shared={fullRecipe.shared}
            openFullRecipe={setFullRecipe}
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
            <RecipeCardFromId
              id={uuid}
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
