import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Box from "@mui/material/Box";

export interface IPreviewCardProps {
  filename: string;
  description: string;
  imageSrc: string;
}

const css = {
  height: 150,
  margin: "auto",
  transition: "0.3s",
  boxShadow: "0 0 40px -12px rgba(0,0,0,0.3)",
  "&:hover": {
    boxShadow: "0 0 70px -12.125px rgba(0,0,0,0.3)",
  },
};

export default function PreviewCard(props: IPreviewCardProps) {
  return (
    <Card sx={{ display: "flex", ...css }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
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
      <Box sx={{ flexGrow: 1 }} />
      <Box
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
  );
}

export const previewCards: IPreviewCardProps[] = [
  {
    filename: "Ash Pot",
    description: "A pot to hold a small succulent.",
    imageSrc: "/images/ash_pot_preview.png",
  },
  {
    filename: "Stand",
    description: "A stand to hold a globe.",
    imageSrc: "/images/stand_preview.jpg",
  },
];
