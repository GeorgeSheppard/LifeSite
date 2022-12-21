import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Tooltip,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { motion } from "framer-motion";
import { NextRouter, useRouter } from "next/router";
import { useCallback, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { headerHeight } from "../../components/core/header";
import { RecipeCardWithDialog } from "../../components/recipes/content_card";
import { Planner } from "../../components/recipes/dnd_calendar";
import { useRecipeSearch } from "../../components/recipes/search_bar";
import { SearchChips } from "../../components/recipes/search_chip";
import {
  createShoppingList,
  createShoppingListData,
  IQuantitiesAndMeals,
} from "../../components/recipes/shopping_list_creator";
import { DateString } from "../../store/reducers/food/meal_plan/types";
import { RecipeUuid } from "../../store/reducers/food/recipes/types";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useBoolean } from "../../components/hooks/use_boolean";
import Chip from "@mui/material/Chip";
import { useMealPlan, useRecipes } from "../../components/hooks/use_data";

const Recipes = () => {
  const [keys, setKeys] = useState(() => new Set(["name"]));
  const { searchInput, setSearchInput, searchResults } = useRecipeSearch(keys);
  const recipes = useRecipes();
  const mealPlan = useMealPlan();
  const [selected, setSelected] = useState<Set<DateString>>(() => new Set());
  const allSelected = selected.size === Object.keys(mealPlan).length;
  const [on, { turnOn, turnOff }] = useBoolean(false);
  const [shoppingListData, setShoppingListData] = useState<IQuantitiesAndMeals>(
    {}
  );

  const selectOrUnselect = useCallback(() => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(Object.keys(mealPlan)));
    }
  }, [setSelected, mealPlan, allSelected]);

  return (
    <main>
      <ShoppingListDialog
        quantityAndMeals={shoppingListData}
        on={on}
        turnOff={turnOff}
      />
      <Container sx={{ py: 8 }} maxWidth="xl">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Box component="div" width="100%">
            <Grid item key={"Search"}>
              <SearchChips keys={keys} setKeys={setKeys} />
              <OutlinedInput
                value={searchInput}
                onChange={setSearchInput}
                sx={{ marginBottom: 3, mt: 1 }}
                placeholder="Search"
                fullWidth
              />
            </Grid>
            <RecipeGrid searchResults={searchResults} />
          </Box>
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "none",
                lg: "block",
                xl: "block",
              },
              pl: 3,
              flexGrow: 1,
            }}
            component="div"
          >
            <div
              className="noSelect"
              style={{
                flexGrow: 1,
                minWidth: 100,
                height: `calc(100vh - 64px - ${headerHeight}px - 40px)`,
                maxWidth: "400px",
                position: "sticky",
                top: 0,
                overflowY: "scroll",
              }}
            >
              <ButtonGroup sx={{ marginLeft: 2, width: 332, marginBottom: 2 }}>
                <Button variant="outlined" onClick={selectOrUnselect}>
                  {allSelected ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setShoppingListData(
                      createShoppingListData(
                        recipes.data,
                        mealPlan.data,
                        selected
                      )
                    );
                    turnOn();
                  }}
                >
                  Create shopping list
                </Button>
              </ButtonGroup>
              <div
                style={{
                  height: "100vh",
                }}
              >
                <Planner selected={selected} setSelected={setSelected} />
              </div>
            </div>
          </Box>
        </div>
      </Container>
    </main>
  );
};

interface RecipeGridProps {
  searchResults: { uuid: RecipeUuid; visible: boolean }[];
}

const RecipeGrid = (props: RecipeGridProps) => {
  const router = useRouter();

  return (
    <Grid container spacing={2} component={motion.div} layout>
      <CreateNewRecipeCard router={router} />
      {props.searchResults.map(({ uuid, visible }) => (
        <Grid
          key={uuid}
          item
          xs={12}
          sm={6}
          md={6}
          lg={6}
          xl={4}
          component={motion.div}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <RecipeCardWithDialog uuid={uuid} router={router} visible={visible} />
        </Grid>
      ))}
    </Grid>
  );
};

interface ICreateNewRecipeCard {
  router: NextRouter;
}

const CreateNewRecipeCard = (props: ICreateNewRecipeCard) => {
  const { router } = props;

  const uuidOnClick = useCallback(() => {
    router.push(`/food/${uuidv4()}`);
  }, [router]);

  return (
    <Grid item key={"CreateRecipe"} xs={12} sm={6} md={6} lg={6} xl={4}>
      <Card
        sx={{
          height: "100%",
          minHeight: "30vh",
          maxHeight: "70vh",
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

interface IShoppingListDialogProps {
  quantityAndMeals: IQuantitiesAndMeals;
  on: boolean;
  turnOff: () => void;
}

const ShoppingListDialog = (props: IShoppingListDialogProps) => {
  const { quantityAndMeals, on, turnOff } = props;

  const [options, setOptions] = useState({
    includeMeals: true,
  });

  const shoppingList = useMemo(() => {
    return createShoppingList(quantityAndMeals, options);
  }, [quantityAndMeals, options]);

  return (
    <Dialog open={on} onClose={turnOff}>
      <DialogTitle sx={{ minWidth: "600px" }}>Shopping list</DialogTitle>
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

export default Recipes;
