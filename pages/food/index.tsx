import Container from "@mui/material/Container";
import NavigatorCard, {
  INavigatorCardProps,
} from "../../components/index/navigator_card";
import Recipes from "./recipes";
import Grid from "@mui/material/Grid";

const foodNavigatorCards: INavigatorCardProps[] = [
  {
    title: "Recipes",
    description: "List of recipes, with pictures, ingredients, and method.",
    imageSrc: "/images/food.jpg",
    href: "/food/recipes",
  },
  {
    title: "Meal Planner",
    description: "Calendar to plan meals with, can also create shopping lists.",
    imageSrc: "/images/food.jpg",
    href: "/food/planner",
  },
];

const Food = () => {
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container spacing={4}>
        {foodNavigatorCards.map((card) => (
          <Grid item key={card.title + card.description} xs={12} sm={12} md={6}>
            <NavigatorCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Food;
