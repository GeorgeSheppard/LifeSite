import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { useRecipe } from "../../core/dynamo/hooks/use_dynamo_get";
import {
  RecipeUuid
} from "../../core/types/recipes";
import { FormWithData } from "../../components/pages/food/[recipeUuid]/form_with_data";

export const NewRecipe = "newRecipe";

const getDefaultRecipe = (uuid: string) => ({
  uuid,
  name: "",
  description: "",
  images: [],
  components: [
    {
      name: "",
      ingredients: [],
      instructions: [],
      storeable: false,
      uuid: uuidv4(),
      servings: 1,
    },
  ],
});

export default function RecipeForm() {
  const router = useRouter();
  const uuid = router.query.recipeUuid as RecipeUuid | undefined;
  const recipe = useRecipe(uuid ?? "");
  if (!uuid) {
    return <LinearProgress />;
  }
  if (uuid === NewRecipe) {
    return <FormWithData recipe={getDefaultRecipe(uuidv4())} />;
  }
  if (recipe.isError) {
    console.error("Error: ", recipe.error);
    router.push("/food");
    return;
  }

  if (recipe.isLoading) {
    return <LinearProgress />;
  }

  return <FormWithData recipe={recipe.data} />;
}
