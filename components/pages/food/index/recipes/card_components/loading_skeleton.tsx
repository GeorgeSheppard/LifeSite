import { Divider } from "@mui/material";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";
import { weightedRandom } from "../../../../../../core/utilities";

export const LoadingRecipeCard = () => {
  const [numComponents, _] = useState(weightedRandom(1, 5));
  const [divider, __] = useState(Math.random() > 0.5);

  return (
      <Card>
        <Skeleton variant="rectangular" height={300} animation="wave" />
        <div className="m-4 space-y-4">
          <Skeleton variant="rectangular" width="60%" height={25} animation="wave" />
          <div className="space-y-2">
            {Array.from(Array(numComponents).keys()).map((num) => {
              return (
                <Skeleton
                  key={num}
                  variant="rectangular"
                  width="30%"
                  height={15}
                  animation="wave"
                />
              );
            })}
          </div>
          {divider && (
            <>
              <Divider />
              <Skeleton variant="rectangular" width="100%" height={15} animation="wave" />
            </>
          )}
        </div>
      </Card>
  );
};
