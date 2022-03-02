import { Box, Card, Container, Grid } from "@mui/material";
import { useAppSelector } from "../../store/hooks/hooks";
import AddIcon from "@mui/icons-material/Add";
import { css } from "../../components/cards/styling";

const Food = () => {
  const recipeUuids = useAppSelector((store) => store.recipes.cards);

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container spacing={4}>
        <Grid item key={"CreateRecipe"} xs={12} sm={6} md={4}>
          <Card
            sx={{
              ...css,
              height: "100%",
              minHeight: recipeUuids.length === 0 ? "30vw" : "100%",
              display: "flex",
            }}
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
            <div>{uuid}</div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Food;
