import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { CardActionArea } from "@mui/material";
import Link from "next/link";

export interface INavigatorCardProps {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
}

export default function NavigatorCard(props: INavigatorCardProps) {
  return (
    <Link href={props.href} passHref>
      <Card className="card" sx={{ maxWidth: 300 }}>
        <CardActionArea focusRipple href={props.href}>
          <CardHeader title={props.title} sx={{fontWeight: 500}} />
          <CardMedia src={props.imageSrc} component="img" height="300px" />
          {/* TODO: All cards expand to be the size of the maximum card on that row */}
          <CardContent className={"content"}>
            <Typography>{props.description}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export const navigatorCards: INavigatorCardProps[] = [
  {
    title: "Plants",
    description: "Plant management, info on my plants, and watering reminders.",
    imageSrc: "/images/plants.jpg",
    href: "/plants",
  },
  {
    title: "Food",
    description: "Recipe management, and shopping list creator.",
    imageSrc: "/images/food.jpg",
    href: "/food",
  },
  {
    title: "3D Printing",
    description: "Things I would like to print at some point.",
    imageSrc: "/images/printing.jpg",
    href: "/printing",
  },
  {
    title: "Library",
    description: "All the books I own, and what I rate them.",
    imageSrc: "/images/bookshelf.jpg",
    href: "/bookshelf",
  },
  {
    title: "Path Finder",
    description: "Visualization of path finding algorithms.",
    imageSrc: "/images/path-finder.jpg",
    href: "/path_finder",
  },
];
