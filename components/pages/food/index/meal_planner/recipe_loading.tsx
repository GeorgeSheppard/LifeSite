import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";
import { weightedRandom } from "../../../../../core/utilities";

export const RecipeLoading = () => {
  const [numComponents, _] = useState(weightedRandom(1, 3));

  return (
    <>
      {Array.from(Array(numComponents).keys()).map((num) => (
        <div style={{ marginBottom: 16 }} key={num}>
          <Skeleton
            variant="text"
            sx={{
              fontSize: 12,
              width: 120,
              marginLeft: 0,
              marginTop: 1,
            }}
          />
          <LoadingComponentLines />
        </div>
      ))}
    </>
  );
};

const LoadingComponentLines = () => {
  const [numLines, _] = useState(weightedRandom(1, 5));

  return (
    <>
      {Array.from(Array(numLines).keys()).map((num) => (
        <Skeleton
          key={num}
          variant="text"
          sx={{
            fontSize: 12,
            width: 250,
            marginLeft: 2,
            marginTop: 1,
          }}
        />
      ))}
    </>
  );
};