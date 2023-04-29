import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";
import { weightedRandom } from "../../../../../../core/utilities";
import { Divider } from "@mui/material";

export const LoadingRecipeCard = () => {
  const [numComponents, _] = useState(weightedRandom(1, 5));
  const [divider, __] = useState(Math.random() > 0.5);

  return (
    <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
      <Card>
        <Skeleton variant="rectangular" height={300} />
        <div className="m-4 space-y-4">
          <Skeleton variant="rectangular" width="60%" height={25} />
          <div className="space-y-2">
            {Array.from(Array(numComponents).keys()).map((num) => {
              return (
                <Skeleton
                  key={num}
                  variant="rectangular"
                  width="30%"
                  height={15}
                />
              );
            })}
          </div>
          {divider && (
            <>
              <Divider />
              <Skeleton variant="rectangular" width="100%" height={15} />
            </>
          )}
        </div>
      </Card>
    </Grid>
  );
};
