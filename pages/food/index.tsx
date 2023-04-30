import { NoSsr } from "@mui/material";
import { useState } from "react";
import { useIsMobileLayout } from "../../components/hooks/is_mobile_layout";
import { DesktopLayout } from "../../components/pages/food/index/desktop_layout";
import { MobileLayout } from "../../components/pages/food/index/mobile_layout";
import { IQuantitiesAndMeals } from "../../core/meal_plan/shopping_list_creator";
import { useRecipes } from "../../core/dynamo/hooks/use_dynamo_get";
import { useBoolean } from "../../core/hooks/use_boolean";
import {
  SearchableAttributes,
  useRecipeSearch,
} from "../../core/recipes/hooks/use_recipe_search";
import { DateString } from "../../core/types/meal_plan";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { RecipeUuid } from "../../core/types/recipes";
import { useSearchDebounce } from "../../core/hooks/use_search_debounce";

const allSearchValues = new Set<SearchableAttributes>([
  "name",
  "description",
  "ingredients",
]);

export type PreviewRecipe = {
  recipe: RecipeUuid;
  user?: string;
};

const getPreviewRecipe = (query: ParsedUrlQuery): PreviewRecipe | undefined => {
  const { recipe, user } = query;
  if (recipe instanceof Array || user instanceof Array) return;
  if (!recipe) return;
  if (!user) return { recipe };
  return { recipe, user };
};

const Recipes = () => {
  const mobileLayout = useIsMobileLayout();
  const router = useRouter();
  const previewRecipe = getPreviewRecipe(router.query);

  const [keys, setKeys] = useState(() => allSearchValues);
  const [searchString, debouncedValue, setSearchString] = useSearchDebounce("");
  const searchResults = useRecipeSearch(
    debouncedValue,
    mobileLayout ? allSearchValues : keys
  );
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
          searchResults={searchResults}
          recipes={recipes}
          selected={selected}
          setSelected={setSelected}
          booleanState={booleanState}
          shoppingListData={shoppingListData}
          setShoppingListData={setShoppingListData}
          previewRecipe={previewRecipe}
          searchString={searchString}
          setSearchString={setSearchString}
        />
      ) : (
        <DesktopLayout
          keys={keys}
          setKeys={setKeys}
          searchResults={searchResults}
          recipes={recipes}
          selected={selected}
          setSelected={setSelected}
          booleanState={booleanState}
          shoppingListData={shoppingListData}
          setShoppingListData={setShoppingListData}
          previewRecipe={previewRecipe}
          searchString={searchString}
          setSearchString={setSearchString}
        />
      )}
    </NoSsr>
  );
};

export default Recipes;
