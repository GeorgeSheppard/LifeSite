import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { PlantPreview } from "../../components/plants/preview_card";
import { useAppSelector } from "../../store/hooks/hooks";
import { useState } from "react";
import { PlantUuid } from "../../store/reducers/plants";
import { EditUploadPlant } from "../../components/plants/edit_upload_plant";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { v4 as uuidv4 } from "uuid";

export default function Plants() {
  const plantUuids = useAppSelector((store) => store.plants.cards);
  const [plantSelected, setPlantSelected] = useState<PlantUuid | null>(null);

  return (
    <main>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          overflowY: "scroll",
          paddingTop: 12,
        }}
        open={!!plantSelected}
        onClick={() => setPlantSelected(null)}
      >
        {plantSelected && (
          <EditUploadPlant
            key={plantSelected + "selected"}
            uuid={plantSelected}
            closeBackdrop={() => setPlantSelected(null)}
          />
        )}
      </Backdrop>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          <Grid item key={"CreatePlant"} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                minHeight: plantUuids.length === 0 ? "30vw" : "100%",
                display: "flex",
              }}
              className="card"
              onClick={() => setPlantSelected(uuidv4())}
            >
              <Box component="div" sx={{ flexGrow: 0.5 }} />
              <Box component="div" sx={{ display: "flex", margin: "auto" }}>
                <AddIcon fontSize="large" />
              </Box>
              <Box component="div" sx={{ flexGrow: 0.5 }} />
            </Card>
          </Grid>
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
