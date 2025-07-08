'use client';

import { NoSsr } from "@mui/material";
import { useState } from "react";
import { useIsMobileLayout } from "../../components/hooks/is_mobile_layout";
import { DesktopLayout } from "../../components/pages/food/index/desktop_layout";
import { MobileLayout } from "../../components/pages/food/index/mobile_layout";
import { IQuantitiesAndMeals } from "../../core/meal_plan/shopping_list_creator";
import { useRecipeIds } from "../../core/dynamo/hooks/use_dynamo_get";
import { useBoolean } from "../../core/hooks/use_boolean";
import {
  SearchableAttributes,
  useRecipeSearch,
} from "../../core/recipes/hooks/use_recipe_search";
import { DateString } from "../../core/types/meal_plan";
import { useSearchDebounce } from "../../core/hooks/use_search_debounce";
import { IRecipe } from "../../core/types/recipes";

const allSearchValues = new Set<SearchableAttributes>([
  "name",
  "description",
  "ingredients",
]);

type Props = { sharedRecipe: IRecipe | null };

export function FoodClient(props: Props) {
  const mobileLayout = useIsMobileLayout();

  const [keys, setKeys] = useState(() => allSearchValues);
  const [searchString, debouncedValue, setSearchString] = useSearchDebounce("");
  const searchResults = useRecipeSearch(
    debouncedValue,
    mobileLayout ? allSearchValues : keys
  );
  const recipeIds = useRecipeIds();
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
          searchResults={searchResults}
          recipeIds={recipeIds}
          selected={selected}
          setSelected={setSelected}
          booleanState={booleanState}
          shoppingListData={shoppingListData}
          setShoppingListData={setShoppingListData}
          sharedRecipe={props.sharedRecipe}
          searchString={searchString}
          setSearchString={setSearchString}
        />
      ) : (
        <DesktopLayout
          keys={keys}
          setKeys={setKeys}
          searchResults={searchResults}
          recipeIds={recipeIds}
          selected={selected}
          setSelected={setSelected}
          booleanState={booleanState}
          shoppingListData={shoppingListData}
          setShoppingListData={setShoppingListData}
          sharedRecipe={props.sharedRecipe}
          searchString={searchString}
          setSearchString={setSearchString}
        />
      )}
    </NoSsr>
  );
} 