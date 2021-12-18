import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import * as React from "react";
import NavigatorCard, { navigatorCards } from "../components/navigator_card";

export default function Home(props: any) {
  return (
    <main>
      {/* Hero unit */}
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
            My personal website, with my projects. Some help me with my everyday
            life, and some are just ideas that I wanted to make.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        {/* End hero unit */}
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
