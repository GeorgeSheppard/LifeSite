import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import { RecipeUuid } from "../../../../store/reducers/food/recipes/types";

export interface IEditRecipeButtonProps {
  uuid: RecipeUuid;
}

export const EditRecipeButton = (props: IEditRecipeButtonProps) => {
  const router = useRouter();

  return (
    <Tooltip title="Edit">
      <IconButton
        onClick={(event) => {
          event?.stopPropagation();
          router.push(`/food/${props.uuid}`);
        }}
        size="small"
        sx={{ alignSelf: "center", mr: 1 }}
      >
        <EditIcon fontSize="small" htmlColor="#212121" />
      </IconButton>
    </Tooltip>
  );
};
