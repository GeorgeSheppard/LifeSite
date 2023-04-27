import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import { useMemo, useState } from "react";
import { useIsMobileLayout } from "../../../../hooks/is_mobile_layout";
import {
  createShoppingList,
  IQuantitiesAndMeals,
} from "../../../../../core/meal_plan/shopping_list_creator";

interface IShoppingListDialogProps {
  quantityAndMeals: IQuantitiesAndMeals;
  on: boolean;
  turnOff: () => void;
}

export const ShoppingListDialog = (props: IShoppingListDialogProps) => {
  const { quantityAndMeals, on, turnOff } = props;

  const mobileLayout = useIsMobileLayout();
  const [options, setOptions] = useState({
    includeMeals: true,
  });

  const shoppingList = useMemo(() => {
    return createShoppingList(quantityAndMeals, options);
  }, [quantityAndMeals, options]);

  return (
    <Dialog open={on} onClose={turnOff} fullScreen={mobileLayout}>
      <DialogTitle sx={{ minWidth: mobileLayout ? "0px" : "600px" }}>
        Shopping list
      </DialogTitle>
      <DialogContent>
        <Chip
          label={"Include meals"}
          size="small"
          variant={options.includeMeals ? "filled" : "outlined"}
          color={options.includeMeals ? "primary" : "default"}
          onClick={() =>
            setOptions((prevOptions) => ({
              ...prevOptions,
              includeMeals: !prevOptions.includeMeals,
            }))
          }
        />
        <DialogContentText sx={{ whiteSpace: "pre-wrap", marginTop: "24px" }}>
          {shoppingList.length > 0
            ? shoppingList
            : "No shopping list, there are either no selected dates or zero servings."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={turnOff} color="error">
          Close
        </Button>
        <Tooltip
          title="Copied!"
          disableFocusListener
          disableHoverListener
          enterTouchDelay={500}
        >
          <Button onClick={() => navigator.clipboard.writeText(shoppingList)}>
            Copy to clipboard
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};
