// TODO: Idea is to have a simple store, can use cards again, and each one can just have
// the name, a visualisation preview, a download link, and if you click on it perhaps a bigger
// visualisation where you have drag controls and color control

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import PreviewCard, { previewCards } from "../../components/cards/preview_card";
import UploadCard from "../../components/cards/upload_model_card";

export default function Printing() {
  return (
    <main>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container direction="column" rowSpacing={4}>
          <Grid item key="upload" xs={12} sm={10} md={2}>
            <UploadCard />
          </Grid>
          {previewCards.map((card) => (
            <Grid item key={card.filename} xs={12} sm={10} md={2}>
              <PreviewCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}
