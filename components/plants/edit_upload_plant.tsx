import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useState, MouseEvent, ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useAppSelector } from "../../store/hooks/hooks";
import {
  PlantUuid,
  IPlant,
  WateringAmountKeys,
  LightLevelKeys,
} from "../../store/reducers/plants";
import UploadIcon from "@mui/icons-material/Upload";
import CardMedia from "@mui/material/CardMedia";

export interface IEditUploadPlant {
  /**
   * New plant will not have a uuid
   */
  uuid?: string;
}

const stopPropagation = (event: MouseEvent<HTMLElement>) => {
  event.stopPropagation();
};

export const EditUploadPlant = (props: IEditUploadPlant) => {
  const [uuid] = useState<PlantUuid>(props.uuid ?? uuidv4());
  // Return either the existing plant data, or a default form
  // Much easier to work with fully defined properties
  const plantData: IPlant = useAppSelector((store) => {
    return props.uuid
      ? store.plants.plants[uuid]
      : {
          uuid,
          name: "",
          description: "",
          lightLevelKey: LightLevelKeys.INDIRECT_SUN,
          wateringKey: WateringAmountKeys.NORMAL,
          temperatureRange: [12, 25],
          images: [],
          reminders: [],
        };
  });
  const [name, setName] = useState(plantData.name);
  const [images, setImages] = useState(plantData.images);

  return (
    <Container sx={{ py: 8 }} maxWidth="md" onClick={stopPropagation}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item key="edit_upload" xs={12} sm={6} md={4}>
          <Card sx={{ padding: 2 }}>
            <TextField
              fullWidth
              label={"Name"}
              value={name}
              id="name"
              variant="standard"
              margin="none"
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setName(event.target.value)
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                paddingTop: 15,
              }}
            >
              <Paper
                elevation={1}
                sx={{ width: 100, height: 100, display: "flex" }}
              >
                <Box component="div" sx={{ flexGrow: 0.5 }} />
                <Box component="div" sx={{ display: "flex", margin: "auto" }}>
                  <UploadIcon fontSize="large" />
                </Box>
                <Box component="div" sx={{ flexGrow: 0.5 }} />
              </Paper>
              {images.map((image) => {
                return (
                  <>
                    <Paper
                      elevation={1}
                      sx={{ width: 100, height: 100, display: "flex" }}
                    >
                      <Box component="div" sx={{ flexGrow: 0.5 }} />
                      <Box
                        component="div"
                        sx={{
                          display: "flex",
                          margin: "auto",
                        }}
                      >
                        <CardMedia
                          src={image.image}
                          component="img"
                          height={100}
                        />
                      </Box>
                      <Box component="div" sx={{ flexGrow: 0.5 }} />
                    </Paper>
                  </>
                );
              })}
            </div>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
