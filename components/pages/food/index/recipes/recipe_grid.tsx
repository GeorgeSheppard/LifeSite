import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { RecipeUuid } from "../../../../../core/types/recipes";
import { CreateNewRecipeCard } from "./card_components/create_new_recipe";
import { LoadingRecipeCard } from "./card_components/loading_skeleton";
import { WithDragging } from "./card_components/with_dragging";
import { RecipeCard } from "./recipe_card";

interface RecipeGridProps {
  searchResults: { uuid: RecipeUuid; visible: boolean }[];
  loading: boolean;
}

export const RecipeGrid = (props: RecipeGridProps) => {
  const [fullRecipe, setFullRecipe] = useState<RecipeUuid | null>(null);
  return (
    <>
      <Dialog
        open={!!fullRecipe}
        onClose={() => setFullRecipe(null)}
        fullWidth
        PaperProps={{ className: "bg-transparent max-w-lg" }}
      >
        <RecipeCard
          uuid={fullRecipe!}
          visible
          isPreview={false}
          onDelete={() => setFullRecipe(null)}
        />
      </Dialog>
      <Grid container spacing={2}>
        <CreateNewRecipeCard />
        {!props.loading ? (
          <>
            {props.searchResults.map(({ uuid, visible }) => (
              <Grid key={uuid} item xs={12} sm={6} md={6} lg={6} xl={4}>
                <WithDragging uuid={uuid}>
                  <RecipeCard
                    uuid={uuid}
                    visible={visible}
                    onClick={() => setFullRecipe(uuid)}
                    isPreview
                  />
                </WithDragging>
              </Grid>
            ))}
          </>
        ) : (
          <>
            {Array.from(Array(15)).map((_, index) => {
              return <LoadingRecipeCard key={index} />;
            })}
          </>
        )}
      </Grid>
    </>
  );
};
