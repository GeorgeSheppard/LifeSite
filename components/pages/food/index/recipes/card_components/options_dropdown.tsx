import IconButton from "@mui/material/IconButton";
import { RecipeUuid } from "../../../../../../core/types/recipes";
import { MoreHoriz } from "@mui/icons-material";
import React, { useState } from "react";
import Popover from "@mui/material/Popover";

export type IEditRecipeButtonProps = React.PropsWithChildren<{
  uuid: RecipeUuid;
}>;

export const OptionsDropdownButton = (props: IEditRecipeButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };
  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="medium" className="p-0 m-2">
        <MoreHoriz fontSize="medium" htmlColor="#212121" />
      </IconButton>
      <Popover
        id={`settings-${props.uuid}`}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {props.children}
      </Popover>
    </>
  );
};