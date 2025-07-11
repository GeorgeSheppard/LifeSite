import { Dispatch, SetStateAction } from "react";
import { MobileStateProps } from "./mobile_layout";
import { ShoppingListDialog } from "./meal_planner/shopping_list";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { SearchChips } from "./search_chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import { CreateShoppingListButton } from "./meal_planner/create_shopping_list";
import { Planner } from "./meal_planner/calendar";
import { headerHeight } from "../../../core/header";
import { SearchableAttributes } from "../../../../core/recipes/hooks/use_recipe_search";
import { RecipeGrid } from "./recipes/recipe_grid";

export const DesktopLayout = (
  props: MobileStateProps & {
    keys: Set<SearchableAttributes>;
    setKeys: Dispatch<SetStateAction<Set<SearchableAttributes>>>;
  }
) => {
  const {
    searchResults,
    recipeIds,
    selected,
    setSelected,
    booleanState: [on, { turnOn, turnOff }],
    shoppingListData,
    setShoppingListData,
    keys,
    setKeys,
    sharedRecipe,
    searchString,
    setSearchString,
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
          <Box
            component="div"
          >
            <Grid item key={"Search"}>
              <SearchChips keys={keys} setKeys={setKeys} />
              <OutlinedInput
                value={searchString}
                onChange={(event) => setSearchString(event.target.value)}
                sx={{ marginBottom: 3, mt: 1, backgroundColor: "white" }}
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
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4} xl={3} sx={{ pl: 2 }}>
          {/* <Box component="div"> */}
            <div
              className="noSelect"
              style={{
                height: `calc(100vh - 64px - ${headerHeight}px - 40px)`,
                position: "fixed",
                overflowY: "scroll",
                paddingLeft: 8,
                paddingRight: 8,
                minWidth: 350,
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
          {/* </Box> */}
        </Grid>
      </Grid>
    </main>
  );
};
