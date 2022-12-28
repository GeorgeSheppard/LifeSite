import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {
  DateString,
  IDailyMealPlan,
} from "../../store/reducers/food/meal_plan/types";
import { RecipeCardWithDeleteDialog } from "../../components/pages/recipes/recipe_card/recipe_card";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";
import { useMealPlan } from "../../components/hooks/use_data";

export default function MealPlan() {
  const mealPlan = useMealPlan().data;
  const router = useRouter();

  return (
    <main>
      <Container sx={{ py: 8 }} maxWidth="xl">
        <Grid container spacing={3}>
          {Object.entries(mealPlan).map(([date, plan]) => {
            return <DailyPlan key={date} date={date} plan={plan} />;
          })}
        </Grid>
      </Container>
    </main>
  );
}

interface IDailyPlanProps {
  date: DateString;
  plan: IDailyMealPlan;
}

function DailyPlan(props: IDailyPlanProps) {
  const { date, plan } = props;

  const recipes = Object.keys(plan);

  return (
    <>
      <Grid item key="Date" xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography fontSize={24} fontWeight={400} pl={1}>
          {date}
        </Typography>
      </Grid>
      {recipes.length > 0 ? (
        recipes.map((recipeId) => {
          return (
            <Grid key={recipeId} item xs={12} sm={6} md={4} lg={3} xl={3}>
              <RecipeCardWithDeleteDialog
                key={recipeId}
                uuid={recipeId}
                visible
              />
            </Grid>
          );
        })
      ) : (
        <Grid key="noRecipes" item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Card className="cardWithHover" sx={{ padding: 2 }}>
            <Typography fontSize={20} fontWeight={400}>
              No meals planned
            </Typography>
          </Card>
        </Grid>
      )}
    </>
  );
}
