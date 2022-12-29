import Grid from "@mui/material/Grid";
import { RecipeUuid } from "../../../../store/reducers/food/recipes/types";
import { CreateNewRecipeCard } from "./create_new_recipe";
import { LoadingRecipeItem } from "./loading_skeleton";
import { RecipeCardWithDeleteDialog } from "./recipe_card";

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
          {Array.from(Array(8)).map((_, index) => {
            return <LoadingRecipeItem key={index} />;
          })}
        </>
      )}
    </Grid>
  );
};
