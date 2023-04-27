import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { weightedRandom } from "../../../../../../core/utilities";

export const LoadingRecipeCard = () => {
  const [numComponents, _] = useState(weightedRandom(1, 5));
  return (
    <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
      <Card>
        <Skeleton variant="rectangular" height={300} />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon htmlColor="#212121" />}>
            <Skeleton variant="rectangular" width="60%" height={30} />
          </AccordionSummary>
        </Accordion>
        {Array.from(Array(numComponents).keys()).map((num) => {
          <Accordion key={num}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon htmlColor="#212121" />}
            >
              <Skeleton variant="rectangular" width="30%" />
            </AccordionSummary>
          </Accordion>;
        })}
      </Card>
    </Grid>
  );
};
