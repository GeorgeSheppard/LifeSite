import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import PreviewCard from "../../components/printing/preview_card";
import UploadCard from "../../components/printing/upload_model_card";
import { useAppSelector } from "../../store/hooks/hooks";

export default function Printing() {
  const cardUuids = useAppSelector((store) => store.printing.cards);

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
