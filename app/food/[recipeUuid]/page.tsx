'use client';

import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useRecipe } from "../../../core/dynamo/hooks/use_dynamo_get";
import { RecipeUuid } from "../../../core/types/recipes";
import { FormWithData } from "../../../components/pages/food/[recipeUuid]/form_with_data";
import { NewRecipe } from "../../../lib/constants";

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

interface Props {
  params: {
    recipeUuid: string;
  };
}

export default function RecipeForm({ params }: Props) {
  const router = useRouter();
  const uuid = params.recipeUuid as RecipeUuid | undefined;
  const recipe = useRecipe(uuid);
  
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

  if (!recipe.data) {
    console.error(`Error: ${uuid} doesn't exist`);
    router.push("/food");
    return;
  }

  return <FormWithData recipe={recipe.data} />;
} 