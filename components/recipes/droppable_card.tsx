import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import {
  addOrUpdatePlan,
  DateString,
  IMealPlanItem,
  removeFromPlan,
} from "../../store/reducers/food/meal_plan";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { MouseEvent, useCallback } from "react";
import { useDrop } from "react-dnd";
import { RecipeUuid } from "../../store/reducers/food/types";

export const DroppableCard = (props: {
  day: DateString;
  selected: boolean;
  onClick: (day: DateString) => (event: MouseEvent<HTMLDivElement>) => void;
}) => {
  const { day, selected, onClick } = props;
  const meals = useAppSelector((store) => store.mealPlan.plan[day]);
  const dispatch = useAppDispatch();

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
  const storedMeal = useAppSelector((store) => {
    return store.food.recipes[meal.uuid];
  });
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
