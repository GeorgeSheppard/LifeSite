import AddIcon from "@mui/icons-material/Add";
import { Box, Card, Container, Grid } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RecipeCard } from "../../components/recipes/content_card";
import { EditUploadRecipe } from "../../components/recipes/edit_upload_recipe";
import { useAppSelector } from "../../store/hooks/hooks";
import { RecipeUuid } from "../../store/reducers/food/recipes";

const Food = () => {
  const recipeUuids = useAppSelector((store) => store.food.cards);
  const [recipeSelected, setRecipeSelected] = useState<RecipeUuid | null>(null);

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
        <Grid container spacing={4}>
          <Grid item key={"CreateRecipe"} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                minHeight: recipeUuids.length === 0 ? "30vw" : "100%",
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
          {recipeUuids.map((uuid) => (
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
