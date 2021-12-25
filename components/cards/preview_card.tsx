import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Box from "@mui/material/Box";
import { css } from "./styling";
import { navigateToPreview } from "../printing/navigate_to_preview";
import { useRouter } from "next/router";
import { useAppSelector } from "../../store/hooks/hooks";

export interface IPreviewCardProps {
  uuid: string;
}

export interface IPreviewCardStylingProps {
  sx?: any;
}

export default function PreviewCard(
  props: IPreviewCardProps & IPreviewCardStylingProps
) {
  const router = useRouter();
  const { sx, uuid } = props;

  const cardData = useAppSelector((store) => store.printing.models[uuid]);

  return (
    <Card
      sx={{ ...sx, display: "flex", ...css }}
      onClick={() => navigateToPreview(router, cardData.modelSrc, uuid)}
    >
      <Box component="div" sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {cardData.filename}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {cardData.description}
          </Typography>
        </CardContent>
      </Box>
      <Box component="div" sx={{ flexGrow: 1 }} />
      <Box
        component="div"
        sx={{
          display: "flex",
          overflow: "hidden",
          width: 150,
          minWidth: 150,
        }}
      >
        {cardData?.imageSrc && (
          <CardMedia component="img" src={cardData.imageSrc} />
        )}
      </Box>
    </Card>
  );
}
