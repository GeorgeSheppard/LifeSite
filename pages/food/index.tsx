import AddIcon from "@mui/icons-material/Add";
import { Box, Card, Container, Grid } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { motion } from "framer-motion";
import { NextRouter, useRouter } from "next/router";
import { memo, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { headerHeight } from "../../components/core/header";
import { RecipeCard } from "../../components/recipes/content_card";
import { useRecipeSearch } from "../../components/recipes/search_bar";
import { SearchChips } from "../../components/recipes/search_chip";
import { RecipeUuid } from "../../store/reducers/food/recipes";
import MealPlanner from "../../components/recipes/planner";

const Recipes = () => {
  const [keys, setKeys] = useState(() => new Set(["name"]));
  const { searchInput, setSearchInput, searchResults } = useRecipeSearch(keys);

  return (
    <main>
      <Container sx={{ py: 8 }} maxWidth="xl">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Box component="div">
            <Grid item key={"Search"}>
              <SearchChips keys={keys} setKeys={setKeys} />
              <OutlinedInput
                value={searchInput}
                onChange={setSearchInput}
                sx={{ marginBottom: 3, mt: 1 }}
                placeholder="Search"
                fullWidth
              />
            </Grid>
            <RecipeGrid searchResults={searchResults} />
          </Box>
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "none",
                lg: "block",
                xl: "block",
              },
              pl: 3,
              flexGrow: 1
            }}
            component="div"
          >
            <div
              style={{
                flexGrow: 1,
                minWidth: 100,
                height: `calc(100vh - 64px - ${headerHeight}px - 20px)`,
                position: "sticky",
                top: 0,
                overflowY: "scroll",
                // TODO: Border of cards get cut off without this
                paddingTop: 3,
                paddingBottom: 3,
              }}
            >
              <MealPlanner />
            </div>
          </Box>
        </div>
      </Container>
    </main>
  );
};

interface RecipeGridProps {
  searchResults: { uuid: RecipeUuid; visible: boolean }[];
}

const RecipeGrid = memo(function RenderRecipeGrid(props: RecipeGridProps) {
  const router = useRouter();

  return (
    <Grid container spacing={4} component={motion.div} layout>
      <CreateNewRecipeCard router={router} />
      {props.searchResults.map(({ uuid, visible }) => (
        <Grid
          key={uuid}
          item
          xs={12}
          sm={6}
          md={4}
          component={motion.div}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <RecipeCard uuid={uuid} router={router} visible={visible} />
        </Grid>
      ))}
    </Grid>
  );
});

interface ICreateNewRecipeCard {
  router: NextRouter;
}

const CreateNewRecipeCard = (props: ICreateNewRecipeCard) => {
  const { router } = props;

  const uuidOnClick = useCallback(() => {
    router.push(`/food/${uuidv4()}`);
  }, [router]);

  return (
    <Grid item key={"CreateRecipe"} xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: "100%",
          minHeight: "30vh",
          maxHeight: "70vh",
          display: "flex",
        }}
        className="cardWithHover"
        onClick={uuidOnClick}
      >
        <Box component="div" sx={{ flexGrow: 0.5 }} />
        <Box component="div" sx={{ display: "flex", margin: "auto" }}>
          <AddIcon fontSize="large" />
        </Box>
        <Box component="div" sx={{ flexGrow: 0.5 }} />
      </Card>
    </Grid>
  );
};

export default Recipes;
