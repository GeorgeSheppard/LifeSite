import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import * as React from "react";
import NavigatorCard from "../components/navigator_card";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Home(props: any) {
  return (
    <main>
      {/* Hero unit */}
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            MyLife
          </Typography>
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
          {cards.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <NavigatorCard
                title="Title"
                description="This is a media card. You can use this section to describe
                    the content."
                imageSrc="/images/plants.jpg"
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}
