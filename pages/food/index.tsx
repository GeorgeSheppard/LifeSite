import AddIcon from "@mui/icons-material/Add";
import { Box, Card, Container, Grid } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { AnimatePresence, motion } from "framer-motion";
import { NextRouter, useRouter } from "next/router";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RecipeCard } from "../../components/recipes/content_card";
import { useRecipeSearch } from "../../components/recipes/search_bar";
import { SearchChip } from "../../components/recipes/search_chip";

const Recipes = () => {
  const router = useRouter();
  const [keys, setKeys] = useState(() => new Set(["name"]));
  const { searchInput, setSearchInput, searchResults } = useRecipeSearch(keys);

  const removeOrAddKey = useCallback((key: string) => {
    setKeys((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  return (
    <main>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid item key={"Search"}>
          <div style={{ justifyContent: "end", display: "flex" }}>
            <SearchChip
              label="Name"
              keys={keys}
              removeOrAddKey={removeOrAddKey}
              property="name"
              sx={{ boxSizing: "border-box", width: 60 }}
            />
            <SearchChip
              label="Description"
              keys={keys}
              removeOrAddKey={removeOrAddKey}
              property="description"
              sx={{ ml: 1, boxSizing: "border-box", width: 90 }}
            />
            <SearchChip
              label="Ingredient"
              keys={keys}
              removeOrAddKey={removeOrAddKey}
              property="ingredients"
              sx={{ ml: 1, boxSizing: "border-box", width: 90 }}
            />
          </div>
          <OutlinedInput
            value={searchInput}
            onChange={setSearchInput}
            sx={{ marginBottom: 3, mt: 1 }}
            placeholder="Search"
            fullWidth
          />
        </Grid>
        <Grid container spacing={4} 
        component={motion.div} layout
        >
          <CreateNewRecipeCard router={router} />
          {searchResults.map((uuid) => (
            <AnimatePresence key={uuid}>
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
                transition={{ delay: 0.1, duration: 0.5 }}
                layout
              >
                <RecipeCard uuid={uuid} router={router} />
              </Grid>
            </AnimatePresence>
          ))}
        </Grid>
      </Container>
    </main>
  );
};

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
          height: "15vw",
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
