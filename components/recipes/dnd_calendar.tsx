import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import { useDrop } from "react-dnd";
import { RecipeUuid } from "../../store/reducers/food/recipes";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import {
  addOrUpdatePlan,
  removeFromPlan,
  DateString,
  IDailyMealPlan,
  IMealPlanItem,
  IMealPlanState,
} from "../../store/reducers/food/meal_plan";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import PersonIcon from "@mui/icons-material/Person";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";

export interface ICalendarRowProps {
  selected: Set<DateString>;
  setSelected: Dispatch<SetStateAction<Set<DateString>>>;
}

export const Planner = (props: ICalendarRowProps) => {
  const { setSelected, selected } = props;
  const [lastSelected, setLastSelected] = useState<DateString | null>(null);
  const mealPlan = useAppSelector(
    (store) => store.mealPlan.plan
  );

  // Toggles selection onClick
  const onClick = useCallback(
    (day: DateString) => (event: MouseEvent<HTMLDivElement>) => {
      setSelected((prevSelected) => {
        const newSelection = new Set(prevSelected);
        if (event.shiftKey) {
          event.preventDefault();
          const dates = Object.keys(mealPlan);
          if (lastSelected) {
            const start = dates.indexOf(lastSelected);
            if (lastSelected !== day) {
              for (const date of dates.slice(start)) {
                newSelection.add(date);
                if (date === day) {
                  break;
                }
              }
            }
          }
        } else {
          if (newSelection.has(day)) {
            newSelection.delete(day);
          } else {
            newSelection.add(day);
          }
        }

        setLastSelected(day);
        return newSelection;
      });
    },
    [setSelected, lastSelected, mealPlan]
  );

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      paddingLeft={2}
      paddingRight={2}
      marginTop={0}
      marginBottom={0}
      flexGrow={1}
    >
      {Object.entries(mealPlan).map(([day], index) => {
        return (
          // TODO: CSS selector instead of this fast hack
          <Grid
            item
            columns={1}
            key={day}
            style={{ paddingTop: index === 0 ? 0 : 16 }}
          >
            <DroppableCard
              day={day}
              selected={selected.has(day)}
              onClick={onClick}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const DroppableCard = (props: {
  day: DateString;
  selected: boolean;
  onClick: (day: DateString) => (event: MouseEvent<HTMLDivElement>) => void;
}) => {
  const { day, selected, onClick } = props;
  const meals = useAppSelector(store => store.mealPlan.plan[day])
  const dispatch = useDispatch();

  const toggleOnClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onClick(day)(event);
    },
    [onClick, day]
  );

  const [collected, drop] = useDrop(
    () => ({
      accept: "recipe",
      drop: (item: { uuid: RecipeUuid }) => {
        dispatch(
          addOrUpdatePlan({
            date: day,
            uuid: item.uuid,
            servingsIncrease: 1,
          })
        );
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [day]
  );

  let className = "card";
  if (collected.isOver || selected) {
    className += " hoveredBorder";
  }

  return (
    <Card className={className} ref={drop} onClick={toggleOnClick}>
      <CardHeader title={day} className="noSelect" />
      <CardContent>
        <div style={{ minHeight: 30, width: 300, flexGrow: 1 }}>
          {meals &&
            meals.map((meal) => (
              <RecipeName key={meal.uuid} meal={meal} day={day} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

const RecipeName = ({
  meal,
  day,
}: {
  meal: IMealPlanItem;
  day: DateString;
}) => {
  const storedMeal = useAppSelector((store) => store.food.recipes[meal.uuid]);
  const dispatch = useAppDispatch();

  if (!storedMeal) {
    return null;
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <p>{storedMeal.name}</p>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip title={`${meal.servings} serving`}>
          {/* div instead of fragment as tooltip doesn't work with fragment */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: 6.5,
              marginLeft: 15,
            }}
          >
            <Typography>{meal.servings}</Typography>
            <PersonIcon sx={{ paddingRight: 0.5 }} />
          </div>
        </Tooltip>
        <ButtonGroup variant="outlined" sx={{ height: 25 }}>
          <Button
            onClick={(event) => {
              event.preventDefault();
              dispatch(
                addOrUpdatePlan({
                  date: day,
                  uuid: meal.uuid,
                  servingsIncrease: -1,
                })
              );
            }}
          >
            -
          </Button>
          <Button
            onClick={(event) => {
              event.preventDefault();
              dispatch(
                addOrUpdatePlan({
                  date: day,
                  uuid: meal.uuid,
                  servingsIncrease: 1,
                })
              );
            }}
          >
            +
          </Button>
        </ButtonGroup>
        <DeleteIcon
          onClick={(event) => {
            event.preventDefault();
            dispatch(
              removeFromPlan({
                date: day,
                uuid: meal.uuid,
              })
            );
          }}
          fontSize="small"
          htmlColor="#7d2020"
          sx={{ ml: 2 }}
        />
      </div>
    </div>
  );
};
