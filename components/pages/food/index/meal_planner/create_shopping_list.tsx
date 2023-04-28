import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import React, { useCallback } from "react";
import {
  createShoppingListData,
  IQuantitiesAndMeals,
} from "../../../../../core/meal_plan/shopping_list_creator";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useMealPlan, useRecipes } from "../../../../../core/dynamo/hooks/use_dynamo_get";
import { DateString } from "../../../../../core/types/meal_plan";

export interface ICreateShoppingListButtonProps {
  selected: Set<DateString>;
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
      <ButtonGroup sx={{ width: "100%", position: "sticky" }}>
        <Button variant="outlined" onClick={selectOrUnselect}>
          {allSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            props.setShoppingList(
              createShoppingListData(
                recipes.data!,
                mealPlan.data,
                selected
              )
            );
            props.openListDialog();
          }}
          disabled={
            props.selected.size === 0 ||
            !recipes.data ||
            mealPlan.isPlaceholderData
          }
        >
          Create shopping list
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
};
