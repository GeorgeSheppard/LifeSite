import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Box from "@mui/material/Box";
import { navigateToPreview } from "./navigate_to_preview";
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

export default function PreviewCard(props: IPreviewCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { uuid } = props;

  const cardData = useAppSelector((store) => store.printing.models[uuid]);

  const onClickToPreview = useCallback(
    (event: MouseEvent) => {
      navigateToPreview(router, cardData.modelSrc, uuid);
      event.stopPropagation();
    },
    [router, cardData.modelSrc, uuid]
  );
  const deleteModelDispatch = useCallback(
    async (event: MouseEvent<SVGElement>) => {
      dispatch(deleteModel(uuid));
      event.stopPropagation();

      const toDelete = [cardData.modelSrc];
      if (cardData.image?.path) {
        toDelete.push(cardData.image.path);
      }
      const response = await fetch("/api/filesDelete", {
        method: "DELETE",
        body: JSON.stringify(toDelete),
      });
      if (!response.ok) {
        console.error(await response.json());
      }
    },
    [dispatch, uuid, cardData.modelSrc, cardData.image?.path]
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
    <Card className="card" sx={{ display: "flex" }} onClick={onClickToPreview}>
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
        {cardData?.image?.path && (
          <CardMedia component="img" src={cardData.image.path} />
        )}
      </Box>
    </Card>
  );
}
