import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Dispatch, SetStateAction, useState } from "react";
import { Typography } from "@mui/material";
import { useDrop } from 'react-dnd'
import { RecipeUuid } from '../../store/reducers/food/recipes';
import { useAppSelector } from '../../store/hooks/hooks';

interface IMealPlan {
  [index: string]: RecipeUuid[];
}

export interface ICalendarRowProps {}

export const CalendarRow = (props: ICalendarRowProps) => {
  const [mealPlan, setMealPlan] = useState<IMealPlan>(() => ({
    "Monday 1st": [],
    "Tuesday 2nd": [],
    "Wednesday 3rd": [],
    "Thursday 4th": [],
    "Friday 5th": [],
    "Saturday 6th": [],
    "Sunday 7th": [],
    "Monday 8th": [],
    "Tuesday 9th": [],
    "Wednesday 10th": [],
    "Thursday 11th": [],
    "Friday 12th": [],
    "Saturday 13th": [],
    "Sunday 14th": []
  }))

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      paddingLeft={2}
      paddingRight={2}
    >
      {Object.entries(mealPlan).map(([day, meals]) => {
        return (
          <Grid item columns={1} key={day}>
            <DroppableCard day={day} setMealPlan={setMealPlan} meals={meals} />
          </Grid>
        );
      })}
    </Grid>
  );
};

const DroppableCard = (props: { day: string, setMealPlan: Dispatch<SetStateAction<IMealPlan>>, meals: RecipeUuid[] }) => {
  const { day, setMealPlan, meals } = props;

  const [collected, drop] = useDrop(
    () => ({
      accept: "recipe",
      drop: (item: { uuid: RecipeUuid }) => {
        setMealPlan(prevMealPlan => {
          const newMealPlan = {...prevMealPlan}
          newMealPlan[day].push(item.uuid)
          return newMealPlan
        });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [day]
  );

  let className = "card"
  if (collected.isOver) {
    className += " hoveredBorder"
  }

  return (
    <Card className={className} ref={drop}>
      <CardHeader title={day} />
      <CardContent>
        <div style={{ width: 100, minHeight: 100 }}>
          {meals.map(meal => <RecipeName key={meal} recipeUuid={meal} />)}
        </div>
      </CardContent>
    </Card>
  );
};

const RecipeName = ({ recipeUuid }: { recipeUuid: RecipeUuid }) => {
  const name = useAppSelector(store => store.food.recipes[recipeUuid].name);

  return <p>{name}</p>
}
