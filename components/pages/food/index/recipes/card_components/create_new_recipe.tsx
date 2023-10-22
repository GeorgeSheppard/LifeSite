import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { NewRecipe } from "../../../../../../pages/food/[recipeUuid]";
import { RecipeContainer } from "../styling/RecipeContainer";

export interface ICreateNewRecipeCard {}

export const CreateNewRecipeCard = (props: ICreateNewRecipeCard) => {
  const router = useRouter();

  const uuidOnClick = useCallback(() => {
    router.push(`/food/${NewRecipe}`);
  }, [router]);
  const uploadExistingOnClick = () => router.push("/food/existingUpload");

  return (
    <>
      <RecipeContainer onClick={uuidOnClick}>
        <Typography variant="button" className="flex p-16 justify-center text-center">
          Create New Recipe
        </Typography>
      </RecipeContainer>
      <RecipeContainer
        onClick={uploadExistingOnClick}
        >
        <Typography variant="button" className="flex p-16 justify-center text-center">
          Upload Existing Recipe
        </Typography>
      </RecipeContainer>
    </>
  );
};
