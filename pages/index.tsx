import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import * as React from "react";
import NavigatorCard, {
  INavigatorCardProps,
} from "../components/pages/index/navigator_card";

export default function Home(props: any) {
  return (
    <main>
      <Head>
        <title>LifeSite</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box
        component="div"
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            My personal website, with some of my projects. If you are logged out
            you will use a default profile that will not be saved. If you choose
            to login, initially you will have a blank account but your changes
            will then be saved. Enjoy!
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {navigatorCards.map((card) => (
            <Grid
              item
              key={card.title + card.description}
              xs={12}
              sm={6}
              md={4}
            >
              <NavigatorCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}

export const navigatorCards: INavigatorCardProps[] = [
  {
    title: "Recipes and meal planner",
    description: "Recipes, with ingredients, method, and search functionality.",
    imageSrc: "/images/ChilliConCarne.jpg",
    href: "/food",
  },
];
