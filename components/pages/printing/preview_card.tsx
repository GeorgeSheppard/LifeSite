import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Box from "@mui/material/Box";
import { navigateToPreview } from "./navigate_to_preview";
import { useRouter } from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import { MouseEvent } from "react";
import { deleteModel } from "../../../store/reducers/printing/printing";
import { getS3SignedUrl } from "../../aws/s3_utilities";
import { S3CardMedia } from "../../cards/s3_card_media";
import { useMutateAndStore } from "../../hooks/user_data";
import { CustomDialog } from "../../core/dialog";
import { usePrint } from "../../hooks/use_data";

export interface IPreviewCardProps {
  uuid: string;
}

export default function PreviewCard(props: IPreviewCardProps) {
  const router = useRouter();
  const { mutate } = useMutateAndStore(deleteModel);
  const { uuid } = props;

  const cardData = usePrint(uuid).data;
  if (!cardData) {
    return null;
  }

  const onClickToPreview = (event: MouseEvent) => {
    navigateToPreview(router, cardData.key, uuid);
    event.stopPropagation();
  };
  const deleteModelOnClick = (
    event: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    event.stopPropagation();
    mutate(uuid);
  };

  const onDownload = async (event: MouseEvent<SVGElement>) => {
    event.stopPropagation();
    const link = document.createElement("a");
    link.download = cardData.filename + "." + cardData.key.split(".").pop();
    const response = await fetch(await getS3SignedUrl(cardData.key));
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.click();
  };

  return (
    <>
      <CustomDialog
        title="Delete this model?"
        content="Are you sure you want to delete this model? This action cannot be
        undone."
        confirmMessage="Yes, I'm sure"
        cancelMessage="No, cancel"
        confirmOnClick={deleteModelOnClick}
      >
        {(open) => (
          <Card
            className="cardWithHover"
            sx={{ display: "flex" }}
            onClick={onClickToPreview}
          >
            <Box
              component="div"
              sx={{ display: "flex", flexDirection: "column" }}
            >
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
                pt: 2,
                pb: 2,
              }}
            >
              <Tooltip title="Preview part">
                <VisibilityIcon
                  sx={{ marginBottom: 2 }}
                  onClick={onClickToPreview}
                />
              </Tooltip>
              <Tooltip title="Download">
                <DownloadIcon onClick={onDownload} />
              </Tooltip>
              <Tooltip title="Delete">
                <DeleteIcon
                  sx={{ marginTop: 2 }}
                  onClick={(event) => {
                    event.stopPropagation();
                    open();
                  }}
                />
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
              {cardData?.image?.key && (
                <S3CardMedia s3Key={cardData.image.key} />
              )}
            </Box>
          </Card>
        )}
      </CustomDialog>
    </>
  );
}
