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
} from "../../store/reducers/food/meal_plan";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import PersonIcon from "@mui/icons-material/Person";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";


export interface ICalendarRowProps {}

export const CalendarRow = (props: ICalendarRowProps) => {
  const mealPlan = useAppSelector((store) => store.mealPlan);

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      paddingLeft={2}
      paddingRight={2}
      flexGrow={1}
    >
      {Object.entries(mealPlan).map(([day, meals]) => {
        return (
          <Grid item columns={1} key={day}>
            <DroppableCard day={day} meals={meals} />
          </Grid>
        );
      })}
    </Grid>
  );
};

const DroppableCard = (props: {
  day: DateString;
  meals: IDailyMealPlan | undefined;
}) => {
  const { day, meals } = props;
  const dispatch = useDispatch();

  const [collected, drop] = useDrop(
    () => ({
      accept: "recipe",
      drop: (item: { uuid: RecipeUuid }) => {
        dispatch(
          addOrUpdatePlan({
            date: day,
            uuid: item.uuid,
            servingsIncrease: 1
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
  if (collected.isOver) {
    className += " hoveredBorder";
  }

  return (
    <Card className={className} ref={drop}>
      <CardHeader title={day} />
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
              marginLeft: 15
            }}
          >
            <Typography>{meal.servings}</Typography>
            <PersonIcon sx={{ paddingRight: 0.5 }} />
          </div>
        </Tooltip>
        <ButtonGroup variant="outlined" sx={{ height: 25 }}>
          <Button onClick={() => {
            dispatch(
              addOrUpdatePlan({
                date: day,
                uuid: meal.uuid,
                servingsIncrease: -1
              })
            );
          }}>-</Button>
          <Button onClick={() => {
            dispatch(
              addOrUpdatePlan({
                date: day,
                uuid: meal.uuid,
                servingsIncrease: 1
              })
            );
          }}>+</Button>
        </ButtonGroup>
        <DeleteIcon onClick={() => dispatch(removeFromPlan({
          date: day,
          uuid: meal.uuid
        }))} fontSize="small" htmlColor="#7d2020" sx={{ ml: 2}} />
      </div>
    </div>
  );
};
