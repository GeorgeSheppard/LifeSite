import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { PlantPreview } from "../../components/plants/preview_card";
import { useAppSelector } from "../../store/hooks/hooks";
import { useState } from "react";
import { PlantUuid } from "../../store/reducers/plants";
import { EditUploadPlant } from "../../components/plants/edit_upload_plant";

export default function Plants() {
  const plantUuids = useAppSelector((store) => store.plants.cards);
  const [plantSelected, setPlantSelected] = useState<PlantUuid | null>(null);

  return (
    <main>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!plantSelected}
        onClick={() => setPlantSelected(null)}
      >
        {plantSelected && (
          <EditUploadPlant
            key={plantSelected + "selected"}
            uuid={plantSelected}
          />
        )}
      </Backdrop>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {plantUuids.map((uuid) => (
            <Grid item key={uuid} xs={12} sm={6} md={4}>
              <PlantPreview
                key={uuid}
                uuid={uuid}
                select={() => setPlantSelected(uuid)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}
