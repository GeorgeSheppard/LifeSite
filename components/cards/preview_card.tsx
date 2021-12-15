import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Box from "@mui/material/Box";
import { css } from "./styling";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

export interface IPreviewCardProps {
  filename: string;
  description: string;
  imageSrc: string;
  uuid: string;
}

export default function PreviewCard(props: IPreviewCardProps) {
  return (
    <Link href={`/printing/${props.uuid}`} passHref>
      <Card sx={{ display: "flex", ...css }}>
        <Box component="div" sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {props.filename}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {props.description}
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
          <CardMedia component="img" src={props.imageSrc} />
        </Box>
      </Card>
    </Link>
  );
}

export const previewCards: IPreviewCardProps[] = [
  {
    filename: "Ash Pot",
    description: "A pot to hold a small succulent.",
    imageSrc: "/images/ash_pot_preview.png",
    uuid: uuidv4(),
  },
  {
    filename: "Stand",
    description: "A stand to hold a globe.",
    imageSrc: "/images/stand_preview.jpg",
    uuid: uuidv4(),
  },
];
