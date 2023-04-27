import { Box, Grid, NoSsr, Tab, Tabs } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Dispatch, SetStateAction, useState } from "react";
import { headerHeight } from "../../components/core/header";
import { Planner } from "../../components/pages/food/meal_planner/calendar";
import {
  IRecipeSearcher,
  useRecipeSearch,
} from "../../core/recipes/hooks/use_recipe_search";
import { SearchChips } from "../../components/pages/food/search_chip";
import { IQuantitiesAndMeals } from "../../components/pages/food/meal_planner/shopping_list_creator";
import { CreateShoppingListButton } from "../../components/pages/food/meal_planner/create_shopping_list";
import { ShoppingListDialog } from "../../components/pages/food/meal_planner/shopping_list";
import { RecipeGrid } from "../../components/pages/food/recipes/recipe_grid";
import { useIsMobileLayout } from "../../components/hooks/is_mobile_layout";
import { IRecipe } from "../../core/types/recipes";
import { UseQueryResult } from "@tanstack/react-query";
import { useRecipes } from "../../core/dynamo/hooks/use_dynamo_get";
import { DateString } from "../../core/types/meal_plan";
import { IUseBoolean, useBoolean } from "../../core/hooks/use_boolean";

const allSearchValues = new Set(["name", "description", "ingredients"]);

const Recipes = () => {
  const mobileLayout = useIsMobileLayout();

  const [keys, setKeys] = useState(() => allSearchValues);
  const recipeSearch = useRecipeSearch(mobileLayout ? allSearchValues : keys);
  const recipes = useRecipes();
  const [selected, setSelected] = useState<Set<DateString>>(() => new Set());
  const booleanState = useBoolean(false);
  const [shoppingListData, setShoppingListData] = useState<IQuantitiesAndMeals>(
    {}
  );

  // NoSsr because of media query used to determine mobile layout or not
  return (
    <NoSsr>
      {mobileLayout ? (
        <MobileLayout
          recipeSearch={recipeSearch}
          recipes={recipes}
          selected={selected}
          setSelected={setSelected}
          booleanState={booleanState}
          shoppingListData={shoppingListData}
          setShoppingListData={setShoppingListData}
        />
      ) : (
        <DesktopLayout
          keys={keys}
          setKeys={setKeys}
          recipeSearch={recipeSearch}
          recipes={recipes}
          selected={selected}
          setSelected={setSelected}
          booleanState={booleanState}
          shoppingListData={shoppingListData}
          setShoppingListData={setShoppingListData}
        />
      )}
    </NoSsr>
  );
};

interface MobileStateProps {
  recipeSearch: IRecipeSearcher;
  recipes: UseQueryResult<IRecipe[]>;
  selected: Set<string>;
  setSelected: Dispatch<SetStateAction<Set<string>>>;
  booleanState: IUseBoolean;
  shoppingListData: IQuantitiesAndMeals;
  setShoppingListData: Dispatch<SetStateAction<IQuantitiesAndMeals>>;
}

type TabOptions = "recipes" | "mealplan";

const MobileLayout = (props: MobileStateProps) => {
  const {
    recipeSearch: { searchInput, setSearchInput, searchResults },
    recipes,
    selected,
    setSelected,
    booleanState: [on, { turnOn, turnOff }],
    shoppingListData,
    setShoppingListData,
  } = props;
  const [tab, setTab] = useState<TabOptions>("recipes");

  const changeTab = (event: React.SyntheticEvent, newValue: TabOptions) => {
    setTab(newValue);
  };

  return (
    <main>
      <Grid
        container
        sx={{ py: 3, margin: "auto", display: "flex", px: 3 }}
        maxWidth="xl"
      >
        <ShoppingListDialog
          quantityAndMeals={shoppingListData}
          on={on}
          turnOff={turnOff}
        />
        <Grid item xs={12} sm={12} md={12}>
          <Tabs
            value={tab}
            onChange={changeTab}
            variant="fullWidth"
            sx={{ marginY: 3 }}
          >
            <Tab value="recipes" label="Recipes" />
            <Tab value="mealplan" label="Meal Plan" />
          </Tabs>
          {tab === "recipes" ? (
            <Box component="div">
              <Grid item key={"Search"} px={0}>
                <OutlinedInput
                  value={searchInput}
                  onChange={setSearchInput}
                  sx={{ marginBottom: 3 }}
                  placeholder="Search"
                  fullWidth
                  disabled={recipes.isLoading}
                />
              </Grid>
              <RecipeGrid
                searchResults={searchResults}
                loading={recipes.isLoading}
              />
            </Box>
          ) : (
            <Box component="div">
              <div className="noSelect">
                <CreateShoppingListButton
                  selected={selected}
                  setSelected={setSelected}
                  openListDialog={turnOn}
                  setShoppingList={setShoppingListData}
                />
                <Planner selected={selected} setSelected={setSelected} />
              </div>
            </Box>
          )}
        </Grid>
      </Grid>
    </main>
  );
};

const DesktopLayout = (
  props: MobileStateProps & {
    keys: Set<string>;
    setKeys: Dispatch<SetStateAction<Set<string>>>;
  }
) => {
  const {
    recipeSearch: { searchInput, setSearchInput, searchResults },
    recipes,
    selected,
    setSelected,
    booleanState: [on, { turnOn, turnOff }],
    shoppingListData,
    setShoppingListData,
    keys,
    setKeys,
  } = props;
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
                disabled={recipes.isLoading}
              />
            </Grid>
            <RecipeGrid
              searchResults={searchResults}
              loading={recipes.isLoading}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4} xl={3} sx={{ pl: 2 }}>
          <Box component="div">
            <div
              className="noSelect"
              style={{
                height: `calc(100vh - 64px - ${headerHeight}px - 40px)`,
                position: "fixed",
                overflowY: "scroll",
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
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
