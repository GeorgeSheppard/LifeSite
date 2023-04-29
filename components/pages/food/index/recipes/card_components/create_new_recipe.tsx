import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { Typography } from "@mui/material";
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
      {/* <Grid item key={"CreateRecipe"} xs={12} sm={6} md={6} lg={6} xl={4}> */}
      <div
        className="flex hover:shadow-xl ease-in duration-200 flex-grow shadow rounded-lg h-40"
        onClick={uuidOnClick}
      >
        <Typography variant="button" className="m-auto">
          Create New Recipe
        </Typography>
      </div>
      {/* </Grid> */}
      {/* <Grid
        item
        key={"UploadExistingRecipe"}
        xs={12}
        sm={6}
        md={6}
        lg={6}
        xl={4}
      > */}
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
