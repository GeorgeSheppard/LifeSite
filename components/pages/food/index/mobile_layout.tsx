import { UseQueryResult } from "@tanstack/react-query";
import { IRecipeSearcher } from "../../../../core/recipes/hooks/use_recipe_search";
import { IRecipe } from "../../../../core/types/recipes";
import { Dispatch, SetStateAction, useState } from "react";
import { IUseBoolean } from "../../../../core/hooks/use_boolean";
import { IQuantitiesAndMeals } from "../../../../core/meal_plan/shopping_list_creator";
import Grid from "@mui/material/Grid";
import { ShoppingListDialog } from "./meal_planner/shopping_list";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import { CreateShoppingListButton } from "./meal_planner/create_shopping_list";
import { Planner } from "./meal_planner/calendar";
import { DateString } from "../../../../core/types/meal_plan";
import { RecipeGrid } from "./recipes/recipe_grid";

export interface MobileStateProps {
  recipeSearch: IRecipeSearcher;
  recipes: UseQueryResult<IRecipe[]>;
  selected: Set<DateString>;
  setSelected: Dispatch<SetStateAction<Set<DateString>>>;
  booleanState: IUseBoolean;
  shoppingListData: IQuantitiesAndMeals;
  setShoppingListData: Dispatch<SetStateAction<IQuantitiesAndMeals>>;
}

type TabOptions = "recipes" | "mealplan";

export const MobileLayout = (props: MobileStateProps) => {
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
