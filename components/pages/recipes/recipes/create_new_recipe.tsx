import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";

export interface ICreateNewRecipeCard {}

export const CreateNewRecipeCard = (props: ICreateNewRecipeCard) => {
  const router = useRouter();

  const uuidOnClick = useCallback(() => {
    router.push(`/food/${uuidv4()}`);
  }, [router]);

  return (
    <Grid item key={"CreateRecipe"} xs={12} sm={6} md={6} lg={6} xl={4}>
      <Card
        sx={{
          height: "300px",
          display: "flex",
        }}
        className="cardWithHover"
        onClick={uuidOnClick}
      >
        <Box component="div" sx={{ flexGrow: 0.5 }} />
        <Box component="div" sx={{ display: "flex", margin: "auto" }}>
          <AddIcon fontSize="large" />
        </Box>
        <Box component="div" sx={{ flexGrow: 0.5 }} />
      </Card>
    </Grid>
  );
};
