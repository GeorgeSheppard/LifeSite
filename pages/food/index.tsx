import AddIcon from "@mui/icons-material/Add";
import { Box, ButtonGroup, Card, Container, Grid } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { motion } from "framer-motion";
import { NextRouter, useRouter } from "next/router";
import { memo, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { headerHeight } from "../../components/core/header";
import { RecipeCardWithDialog } from "../../components/recipes/content_card";
import { useRecipeSearch } from "../../components/recipes/search_bar";
import { SearchChips } from "../../components/recipes/search_chip";
import { RecipeUuid } from "../../store/reducers/food/types";
import Button from "@mui/material/Button";
import { Planner } from "../../components/recipes/dnd_calendar";
import { DateString } from "../../store/reducers/food/meal_plan";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useAppSelector } from "../../store/hooks/hooks";
import { createShoppingList } from "../../components/recipes/shopping_list_creator";

const Recipes = () => {
  const [keys, setKeys] = useState(() => new Set(["name"]));
  const { searchInput, setSearchInput, searchResults } = useRecipeSearch(keys);
  const mealPlan = useAppSelector((store) => store.mealPlan.plan);
  const recipes = useAppSelector((store) => store.food.recipes);
  const [selected, setSelected] = useState<Set<DateString>>(() => new Set());
  const allSelected = selected.size === Object.keys(mealPlan).length;

  const selectOrUnselect = useCallback(() => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(Object.keys(mealPlan)));
    }
  }, [setSelected, mealPlan, allSelected]);

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
          {/* <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "none",
                lg: "block",
                xl: "block",
              },
              pl: 3,
              flexGrow: 1,
            }}
            component="div"
          >
            <div
              className="noSelect"
              style={{
                flexGrow: 1,
                minWidth: 100,
                height: `calc(100vh - 64px - ${headerHeight}px - 20px)`,
                maxWidth: "400px",
                position: "sticky",
                top: 0,
                overflowY: "scroll",
                // TODO: Border of cards get cut off without this
                paddingTop: 3,
                paddingBottom: 3,
              }}
            >
              <ButtonGroup sx={{ marginLeft: 2, width: 332, marginBottom: 2 }}>
                <Button variant="outlined" onClick={selectOrUnselect}>
                  {allSelected ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    const meals = Object.keys(mealPlan).map((day) => {
                      if (selected.has(day)) {
                        return mealPlan[day];
                      } else {
                        return [];
                      }
                    });
                    const text = createShoppingList(recipes, meals);
                    if (text) {
                      navigator.clipboard.writeText(text);
                    }
                  }}
                >
                  Create shopping list
                </Button>
              </ButtonGroup>
              <div
                style={{
                  height: "100vh",
                }}
              >
                <Planner selected={selected} setSelected={setSelected} />
              </div>
            </div>
          </Box> */}
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
          <RecipeCardWithDialog uuid={uuid} router={router} visible={visible} />
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
