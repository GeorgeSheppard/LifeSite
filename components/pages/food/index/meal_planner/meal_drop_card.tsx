import AddIcon from "@mui/icons-material/Add";
import { Dialog, DialogContent, List, ListItem } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Dispatch, MouseEvent, SetStateAction, useCallback } from "react";
import { useDrop } from "react-dnd";
import {
  useMealPlan,
  useRecipes,
} from "../../../../../core/dynamo/hooks/use_dynamo_get";
import { usePutMealPlanToDynamo } from "../../../../../core/dynamo/hooks/use_dynamo_put";
import { useBoolean } from "../../../../../core/hooks/use_boolean";
import { DateString } from "../../../../../core/types/meal_plan";
import { RecipeUuid } from "../../../../../core/types/recipes";
import { useIsMobileLayout } from "../../../../hooks/is_mobile_layout";
import { RecipeName } from "./recipe";
import { RecipeLoading } from "./recipe_loading";
import { currentDate, dateToDateString } from "../../../../../core/meal_plan/meal_plan_utilities";
import { mainGreen } from "../../../../core/theme";

export const DroppableCard = (props: {
  day: DateString;
  selected: boolean;
  setSelected: Dispatch<SetStateAction<Set<DateString>>>;
  onClick: (day: DateString) => (event: MouseEvent<HTMLDivElement>) => void;
  loading: boolean;
}) => {
  const { day, selected, onClick, setSelected, loading } = props;
  const meals = useMealPlan().data[day];
  const recipes = useRecipes().data;
  const { mutate, disabled } = usePutMealPlanToDynamo();
  const [dialogOpen, setters] = useBoolean(false);

  const toggleOnClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onClick(day)(event);
    },
    [onClick, day]
  );

  const addRecipeToMealPlan = (item: { uuid: RecipeUuid }) => {
    mutate({
      date: day,
      components:
        recipes
          ?.find((rec) => rec.uuid === item.uuid)
          ?.components.map((component) => ({
            recipeId: item.uuid,
            componentId: component.uuid,
            servingsIncrease: component.servings ?? 1,
          })) ?? [],
    });
    if (!selected) {
      setSelected((prevSelected) => {
        const newSelected = new Set(prevSelected);
        newSelected.add(day);
        return newSelected;
      });
    }
  };

  const [collected, drop] = useDrop(
    () => ({
      accept: "recipe",
      drop: addRecipeToMealPlan,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      canDrop: () => !disabled && !loading,
    }),
    [day, recipes, setSelected]
  );

  const mobileLayout = useIsMobileLayout();
  const dayWithoutYear = day.slice(0, day.length - 5);

  const currentDay = dateToDateString(currentDate())
  const isCurrentDay = day === currentDay
  return (
    <>
      <Dialog open={dialogOpen} onClose={setters.turnOff}>
        <DialogContent>
          {recipes?.length === 0 ? (
            <Typography>No recipes available</Typography>
          ) : (
            <List>
              {recipes?.map((recipe) => {
                return (
                  <ListItem key={recipe.uuid}>
                    <Button
                      onClick={() => {
                        addRecipeToMealPlan({ uuid: recipe.uuid });
                        setters.turnOff();
                      }}
                      disabled={disabled}
                    >
                      {recipe.name}
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
      </Dialog>
      {/* Would like to use a class here for the hovered border but ran into this
      https://github.com/mui/material-ui/issues/25324 */}
      <div
        className={`card px-4 py-2 space-y-4 ease-in duration-200 flex-grow rounded-lg ${
          selected || collected.isOver
            ? "shadow-[0_0_0_3px_rgba(32,125,57,0.3)]"
            : "shadow"
        }`}
        ref={drop}
        onClick={toggleOnClick}
      >
        <div className="flex grow place-content-between">
          <Typography
            variant="subtitle1"
            className="grow my-auto font-[500] noSelect underline"
            color={isCurrentDay ? mainGreen : "#222222"}
          >
            {dayWithoutYear}
          </Typography>
          {mobileLayout && (
            <Button
              variant="contained"
              startIcon={<AddIcon fontSize="large" />}
              onClick={(event) => {
                event.stopPropagation();
                setters.turnOn();
              }}
              disabled={loading}
            >
              Add
            </Button>
          )}
        </div>
        {loading && <RecipeLoading />}
        <div className="space-y-2">
          {meals &&
            Object.entries(meals).map(([recipeId, components]) => (
              <RecipeName
                key={recipeId}
                components={components}
                recipeId={recipeId}
                day={day}
              />
            ))}
        </div>
      </div>
    </>
  );
};
