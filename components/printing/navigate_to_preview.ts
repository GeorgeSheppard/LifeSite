import { NextRouter } from "next/router";
import { IPreviewCardProps } from "../cards/preview_card";

export const navigateToPreview = (
  router: NextRouter,
  writePath: string,
  uuid?: string
): void => {
  router.push(
    {
      pathname: `/printing/preview`,
      query: { writePath, uuid },
    },
    "/printing/preview"
  );
};
