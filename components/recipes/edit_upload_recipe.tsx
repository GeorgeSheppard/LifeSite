import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { RecipeUuid } from "../../store/reducers/food/recipes";

export interface IEditUploadRecipeProps {
  /**
   * New recipe will have a uuid but no data in store
   */
  uuid: RecipeUuid;
  closeBackdrop: () => void;
}

export const EditUploadRecipe = (props: IEditUploadRecipeProps) => {
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Card sx={{ padding: 10 }} />
    </Container>
  );
};
