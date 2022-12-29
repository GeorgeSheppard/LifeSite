import { NextRouter } from "next/router";
import { S3Key } from "../../../store/reducers/types";

export const navigateToPreview = (
  router: NextRouter,
  key: S3Key,
  uuid?: string
): void => {
  router.push(
    {
      pathname: `/printing/preview`,
      query: { key, uuid },
    },
    "/printing/preview"
  );
};
