import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { NewRecipe } from "../../../../../../pages/food/[recipeUuid]";

export interface ICreateNewRecipeCard {}

export const CreateNewRecipeCard = (props: ICreateNewRecipeCard) => {
  const router = useRouter();

  const uuidOnClick = useCallback(() => {
    router.push(`/food/${NewRecipe}`);
  }, [router]);
  const uploadExistingOnClick = () => router.push("/food/existingUpload");

  return (
    <>
      <div
        className="flex hover:shadow-xl ease-in duration-200 flex-grow shadow rounded-lg h-40"
        onClick={uuidOnClick}
      >
        <Typography variant="button" className="m-auto">
          Create New Recipe
        </Typography>
      </div>
      <div
        className="flex hover:shadow-xl ease-in duration-200 flex-grow shadow rounded-lg h-40"
        onClick={uploadExistingOnClick}
      >
        <Typography variant="button" className="m-auto">
          Upload Existing Recipe
        </Typography>
      </div>
    </>
  );
};
