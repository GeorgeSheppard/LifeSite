import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Box from "@mui/material/Box";
import { css } from "./styling";
import { navigateToPreview } from "../printing/navigate_to_preview";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import { useCallback, MouseEvent } from "react";
import { deleteModel } from "../../store/reducers/printing";

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
  const dispatch = useAppDispatch();
  const { sx, uuid } = props;

  const cardData = useAppSelector((store) => store.printing.models[uuid]);

  const onClickToPreview = useCallback(
    (event: MouseEvent) => {
      navigateToPreview(router, cardData.modelSrc, uuid);
      event.stopPropagation();
    },
    [router, cardData.modelSrc, uuid]
  );
  const deleteModelDispatch = useCallback(
    (event: MouseEvent<SVGElement>) => {
      dispatch(deleteModel(uuid));
      event.stopPropagation();
    },
    [dispatch, uuid]
  );
  const onDownload = useCallback(
    (event: MouseEvent<SVGElement>) => {
      const link = document.createElement("a");
      link.download =
        cardData.filename + "." + cardData.modelSrc.split(".").pop();
      link.href = cardData.modelSrc;
      link.click();
      event.stopPropagation();
    },
    [cardData]
  );

  return (
    <Card sx={{ ...sx, display: "flex", ...css }} onClick={onClickToPreview}>
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
        m={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          paddingRight: 2,
        }}
      >
        <Tooltip title="Preview part">
          <VisibilityIcon sx={{ marginBottom: 2 }} onClick={onClickToPreview} />
        </Tooltip>
        <Tooltip title="Download">
          <DownloadIcon onClick={onDownload} />
        </Tooltip>
        <Tooltip title="Delete">
          <DeleteIcon sx={{ marginTop: 2 }} onClick={deleteModelDispatch} />
        </Tooltip>
      </Box>
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
