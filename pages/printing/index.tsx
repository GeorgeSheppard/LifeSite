import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { usePrinting } from "../../components/hooks/user_data/use_dynamo";
import PreviewCard from "../../components/pages/printing/preview_card";
import UploadCard from "../../components/pages/printing/upload_model_card";

export default function Printing() {
  const cardUuids = usePrinting().data.map(card => card.uuid);

  return (
    <main>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container direction="column" rowSpacing={4}>
          <Grid item key="upload" xs={12} sm={10} md={2}>
            <UploadCard />
          </Grid>
          {cardUuids.map((uuid) => (
            <Grid item key={uuid} xs={12} sm={10} md={2}>
              <PreviewCard uuid={uuid} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}
