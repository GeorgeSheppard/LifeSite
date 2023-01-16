import { Box, Grid, Typography } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { CSSProperties, useState } from "react";
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
import { useIsMobileLayout } from "../../components/pages/recipes/hooks/is_mobile_layout";

const Recipes = () => {
  const [keys, setKeys] = useState(() => new Set(["name"]));
  const { searchInput, setSearchInput, searchResults } = useRecipeSearch(keys);
  const recipes = useRecipes();
  const [selected, setSelected] = useState<Set<DateString>>(() => new Set());
  const [on, { turnOn, turnOff }] = useBoolean(false);
  const [shoppingListData, setShoppingListData] = useState<IQuantitiesAndMeals>(
    {}
  );
  const mobileLayout = useIsMobileLayout();

  const plannerSx: CSSProperties = mobileLayout
    ? {}
    : {
        height: `calc(100vh - 64px - ${headerHeight}px - 40px)`,
        position: "fixed",
        top: 0,
        overflowY: "scroll",
      };

  return (
    <main>
      <ShoppingListDialog
        quantityAndMeals={shoppingListData}
        on={on}
        turnOff={turnOff}
      />
      <Grid
        container
        sx={{ py: 8, margin: "auto", display: "flex", px: 2 }}
        maxWidth="xl"
      >
        <Grid item xs={12} sm={12} md={12} lg={8} xl={9}>
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
            <RecipeGrid
              searchResults={searchResults}
              loading={recipes.isFetching && !recipes.isRefetching}
            />
          </Box>
        </Grid>
        {mobileLayout && (
          <Typography variant="h3" sx={{ py: 3, pl: 2 }}>
            Meal plan
          </Typography>
        )}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={4}
          xl={3}
          sx={{ pl: !mobileLayout ? 2 : 0 }}
        >
          <Box component="div">
            <div className="noSelect" style={plannerSx}>
              <CreateShoppingListButton
                selected={selected}
                setSelected={setSelected}
                openListDialog={turnOn}
                setShoppingList={setShoppingListData}
              />
              <Planner selected={selected} setSelected={setSelected} />
            </div>
          </Box>
        </Grid>
      </Grid>
    </main>
  );
};

export default Recipes;
