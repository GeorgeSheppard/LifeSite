import AddIcon from "@mui/icons-material/Add";
import { Box, Card, Container, Grid } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { ChangeEvent, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { RecipeCard } from "../../components/recipes/content_card";
import { EditUploadRecipe } from "../../components/recipes/edit_upload_recipe";
import { useAppSelector } from "../../store/hooks/hooks";
import { RecipeUuid } from "../../store/reducers/food/recipes";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useQuerySearch } from "../../components/recipes/search";

const Food = () => {
  const recipes = useAppSelector((store) => store.food.recipes);
  const [recipeSelected, setRecipeSelected] = useState<RecipeUuid | null>(null);

  const { search } = useQuerySearch(recipes);
  const [searchInput, setSearchInput] = useState("");

  const searchResults = useMemo(() => {
    if (searchInput.length > 0) {
      const results = search(searchInput);
      return results.map((result) => result.item.uuid)
    } else {
      return Object.keys(recipes);
    }
  }, [search, searchInput, recipes])

  return (
    <main>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          overflowY: "scroll",
          paddingTop: 12,
        }}
        open={!!recipeSelected}
        onClick={() => setRecipeSelected(null)}
      >
        {recipeSelected && (
          <EditUploadRecipe
            key={recipeSelected + "selected"}
            uuid={recipeSelected}
            closeBackdrop={() => setRecipeSelected(null)}
          />
        )}
      </Backdrop>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid item key={"Search"}>
          <OutlinedInput
            id="outlined-adornment-weight"
            value={searchInput}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchInput(event.target.value)
            }
            aria-describedby="outlined-weight-helper-text"
            sx={{marginBottom: 3}}
            placeholder="Search"
            fullWidth
          />
        </Grid>
        <Grid container spacing={4}>
          <Grid item key={"CreateRecipe"} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                minHeight: searchResults.length === 0 ? "30vw" : "100%",
                display: "flex",
              }}
              className="card"
              onClick={() => setRecipeSelected(uuidv4())}
            >
              <Box component="div" sx={{ flexGrow: 0.5 }} />
              <Box component="div" sx={{ display: "flex", margin: "auto" }}>
                <AddIcon fontSize="large" />
              </Box>
              <Box component="div" sx={{ flexGrow: 0.5 }} />
            </Card>
          </Grid>
          {searchResults.map((uuid) => (
            <Grid item key={uuid} xs={12} sm={6} md={4}>
              <RecipeCard uuid={uuid} onEdit={() => setRecipeSelected(uuid)} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
};

export default Food;
