import InventoryIcon from "@mui/icons-material/Inventory";
import Tooltip from "@mui/material/Tooltip";

export const Storeable = ({ storeable }: { storeable?: boolean }) => {
  return (
    <Tooltip title={storeable ? "Can be stored" : "Can't be stored"}>
      <InventoryIcon
        fontSize="small"
        htmlColor="#212121"
        className={`block m-auto ${storeable ? "opacity-100" : "opacity-20"}`}
      />
    </Tooltip>
  );
};
