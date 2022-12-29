import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";

export interface IDeleteRecipeButtonProps {
  onClick: () => void;
}

export const DeleteRecipeButton = (props: IDeleteRecipeButtonProps) => {
  return (
    <Tooltip title="Delete">
      <IconButton
        onClick={(event) => {
          event?.stopPropagation();
          props.onClick();
        }}
        size="small"
        sx={{ alignSelf: "center", mr: 1 }}
      >
        <DeleteIcon fontSize="small" htmlColor="#7d2020" />
      </IconButton>
    </Tooltip>
  );
};
