import { Box, Container, Grid } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useState } from "react";
import { headerHeight } from "../../components/core/header";
import { Planner } from "../../components/pages/recipes/meal_planner/calendar";
import { useRecipeSearch } from "../../components/pages/recipes/search/search_bar";
import { SearchChips } from "../../components/pages/recipes/search/search_chip";
import { IQuantitiesAndMeals } from "../../components/pages/recipes/meal_planner/shopping_list_creator";
import { DateString } from "../../store/reducers/food/meal_plan/types";
import { useBoolean } from "../../components/hooks/use_boolean";
import { useRecipes } from "../../components/hooks/use_data";
import { CreateShoppingListButton } from "../../components/pages/recipes/meal_planner/create_shopping_list";
import { ShoppingListDialog } from "../../components/pages/recipes/meal_planner/shopping_list";
import { RecipeGrid } from "../../components/pages/recipes/recipes/recipe_grid";

const Recipes = () => {
  const [keys, setKeys] = useState(() => new Set(["name"]));
  const { searchInput, setSearchInput, searchResults } = useRecipeSearch(keys);
  const recipes = useRecipes();
  const [selected, setSelected] = useState<Set<DateString>>(() => new Set());
  const [on, { turnOn, turnOff }] = useBoolean(false);
  const [shoppingListData, setShoppingListData] = useState<IQuantitiesAndMeals>(
    {}
  );

  return (
    <main>
      <ShoppingListDialog
        quantityAndMeals={shoppingListData}
        on={on}
        turnOff={turnOff}
      />
      <Container sx={{ py: 8 }} maxWidth="xl">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Box component="div" width="100%">
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
            <RecipeGrid
              searchResults={searchResults}
              loading={recipes.isFetching && !recipes.isRefetching}
            />
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
              flexGrow: 1,
            }}
            component="div"
          >
            <div
              className="noSelect"
              style={{
                flexGrow: 1,
                minWidth: 100,
                height: `calc(100vh - 64px - ${headerHeight}px - 40px)`,
                maxWidth: "400px",
                position: "sticky",
                top: 0,
                overflowY: "scroll",
              }}
            >
              <CreateShoppingListButton
                selected={selected}
                setSelected={setSelected}
                openListDialog={turnOn}
                setShoppingList={setShoppingListData}
              />
              <div
                style={{
                  height: "100vh",
                }}
              >
                <Planner selected={selected} setSelected={setSelected} />
              </div>
            </div>
          </Box>
        </div>
      </Container>
    </main>
  );
};

export default Recipes;
