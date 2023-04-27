import Grid from "@mui/material/Grid";
import { RecipeCardWithDeleteDialog } from "./recipe_card";
import { CreateNewRecipeCard } from "./card_components/create_new_recipe";
import { RecipeUuid } from "../../../../../core/types/recipes";
import { LoadingRecipeCard } from "./card_components/loading_skeleton";

interface RecipeGridProps {
  searchResults: { uuid: RecipeUuid; visible: boolean }[];
  loading: boolean;
}

export const RecipeGrid = (props: RecipeGridProps) => {
  return (
    <Grid container spacing={2}>
      <CreateNewRecipeCard />
      {!props.loading ? (
        <>
          {props.searchResults.map(({ uuid, visible }) => (
            <Grid key={uuid} item xs={12} sm={6} md={6} lg={6} xl={4}>
              <RecipeCardWithDeleteDialog uuid={uuid} visible={visible} />
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
  );
};
