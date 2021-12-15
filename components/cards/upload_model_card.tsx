import Card from "@mui/material/Card";
import { css } from "./styling";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import Link from "next/link";

export default function UploadCard() {
  return (
    <Link
      href={{ pathname: "/printing/[slug]", query: { slug: "upload" } }}
      passHref
    >
      <Card sx={{ display: "flex", ...css }}>
        <Box sx={{ flexGrow: 0.5 }} />
        <Box sx={{ display: "flex", margin: "auto" }}>
          <UploadIcon fontSize="large" />
        </Box>
        <Box sx={{ flexGrow: 0.5 }} />
      </Card>
    </Link>
  );
}
