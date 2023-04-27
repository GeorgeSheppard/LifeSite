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
  const uploadExistingOnClick = () => router.push('/food/existingUpload'
  )

  return (
    <>
    <Grid item key={"CreateRecipe"} xs={12} sm={6} md={6} lg={6} xl={4}>
      <Card
        sx={{
          height: "150px",
          display: "flex",
        }}
        className="cardWithHover"
        onClick={uuidOnClick}
        >
        <Box component="div" sx={{ flexGrow: 0.5 }} />
        <Box component="div" sx={{ display: "flex", margin: "auto" }}>
          <Typography fontSize={22}>Create New Recipe</Typography>
        </Box>
        <Box component="div" sx={{ flexGrow: 0.5 }} />
      </Card>
      </Grid>
      <Grid item key={"UploadExistingRecipe"} xs={12} sm={6} md={6} lg={6} xl={4}>
      <Card
        sx={{
          height: "150px",
          display: "flex",
        }}
        className="cardWithHover"
        onClick={uploadExistingOnClick}
      >
        <Box component="div" sx={{ flexGrow: 0.5 }} />
        <Box component="div" sx={{ display: "flex", margin: "auto" }}>
        <Typography fontSize={22}>Upload Existing Recipe</Typography>
        </Box>
        <Box component="div" sx={{ flexGrow: 0.5 }} />
      </Card>
    </Grid>
        </>
  );
};
