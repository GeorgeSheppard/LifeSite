import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import React, { useCallback } from "react";
import { useMealPlan, useRecipes } from "../../../hooks/use_data";
import {
  createShoppingListData,
  IQuantitiesAndMeals,
} from "./shopping_list_creator";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

export interface ICreateShoppingListButtonProps {
  selected: Set<string>;
  openListDialog: () => void;
  setShoppingList: (data: IQuantitiesAndMeals) => void;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const CreateShoppingListButton = (
  props: ICreateShoppingListButtonProps
) => {
  const { selected, setSelected } = props;

  const recipes = useRecipes();
  const mealPlan = useMealPlan();

  const allSelected = selected.size === Object.keys(mealPlan.data).length;

  const selectOrUnselect = useCallback(() => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(Object.keys(mealPlan.data)));
    }
  }, [setSelected, mealPlan, allSelected]);

  return (
    <Tooltip
      title={
        props.selected.size === 0
          ? "Drag recipes into your meal plan, then select date(s) manually or use the checkbox to select all available dates to create a shopping list"
          : ""
      }
      placement="bottom"
    >
      <ButtonGroup sx={{ width: "100%", marginBottom: 2 }}>
        <Button variant="outlined" onClick={selectOrUnselect}>
          {allSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            props.setShoppingList(
              createShoppingListData(recipes.data ?? [], mealPlan.data, selected)
            );
            props.openListDialog();
          }}
          disabled={props.selected.size === 0}
        >
          Create shopping list
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
};
