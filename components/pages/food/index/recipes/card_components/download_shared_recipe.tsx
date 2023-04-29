import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { IRecipe } from "../../../../../../core/types/recipes";
import SaveIcon from '@mui/icons-material/Save';
import { usePutRecipeToDynamo } from "../../../../../../core/dynamo/hooks/use_dynamo_put";

export interface ICopyIngredientsButtonProps {
  recipe: IRecipe;
}

export const DownloadSharedRecipe = (props: ICopyIngredientsButtonProps) => {
  const { mutate, isLoading } = usePutRecipeToDynamo();
  const downloadSharedRecipe = () => mutate(props.recipe)

  return (
    <Tooltip title="Download shared recipe">
      <IconButton
        onClick={downloadSharedRecipe}
        size="small"
        disabled={isLoading}
      >
        <SaveIcon fontSize="small" htmlColor="#212121" />
      </IconButton>
    </Tooltip>
  );
};
