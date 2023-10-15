import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { UseQueryResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { IUseBoolean } from "../../../../core/hooks/use_boolean";
import { IQuantitiesAndMeals } from "../../../../core/meal_plan/shopping_list_creator";
import { DateString } from "../../../../core/types/meal_plan";
import { RecipeUuid } from "../../../../core/types/recipes";
import { Planner } from "./meal_planner/calendar";
import { CreateShoppingListButton } from "./meal_planner/create_shopping_list";
import { ShoppingListDialog } from "./meal_planner/shopping_list";
import { RecipeGrid } from "./recipes/recipe_grid";
import { SharedRecipeId } from "../../../../core/dynamo/dynamo_utilities";

export interface MobileStateProps {
  searchResults: RecipeUuid[];
  recipeIds: UseQueryResult<RecipeUuid[]>;
  selected: Set<DateString>;
  setSelected: Dispatch<SetStateAction<Set<DateString>>>;
  booleanState: IUseBoolean;
  shoppingListData: IQuantitiesAndMeals;
  setShoppingListData: Dispatch<SetStateAction<IQuantitiesAndMeals>>;
  sharedRecipe?: SharedRecipeId;
  searchString: string;
  setSearchString: (value: string) => void;
}

type TabOptions = "recipes" | "mealplan";

export const MobileLayout = (props: MobileStateProps) => {
  const {
    searchResults,
    recipeIds,
    selected,
    setSelected,
    booleanState: [on, { turnOn, turnOff }],
    shoppingListData,
    setShoppingListData,
    sharedRecipe,
    searchString,
    setSearchString
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
                  value={searchString}
                  onChange={(event) => setSearchString(event.target.value)}
                  sx={{ marginBottom: 3 }}
                  placeholder="Search"
                  fullWidth
                  disabled={recipeIds.isLoading}
                />
              </Grid>
              <RecipeGrid
                searchResults={searchResults}
                loading={recipeIds.isLoading}
                sharedRecipe={sharedRecipe}
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
