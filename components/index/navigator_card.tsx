import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { CardActionArea } from "@mui/material";
import Link from "next/link";
import { stopPropagation } from "../cards/utilities";

export interface INavigatorCardProps {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  disabled?: boolean;
}

export default function NavigatorCard(props: INavigatorCardProps) {
  const cardClickable = (
    <>
      <CardHeader title={props.title} sx={{ fontWeight: 500 }} />
      <CardMedia src={props.imageSrc} component="img" height="300px" />
      {/* TODO: All cards expand to be the size of the maximum card on that row */}
      <CardContent className={"content"}>
        <Typography>{props.description}</Typography>
      </CardContent>
    </>
  );

  return (
    <div
      style={{
        position: "relative",
      }}
      onClick={stopPropagation}
    >
      {props.disabled && (
        <Typography
          sx={{
            textAlign: "center",
            position: "absolute",
            left: "5%",
            top: "40%",
            fontSize: 40,
            color: "black",
            zIndex: 100,
            opacity: 0.8,
          }}
        >
          Coming soon
        </Typography>
      )}
      <div
        style={{
          color: "white",
          opacity: props.disabled ? 0.5 : 1.0,
        }}
      >
        <Card
          className={props.disabled ? "card" : "cardWithHover"}
          sx={{ maxWidth: 300 }}
        >
          {props.disabled ? (
            cardClickable
          ) : (
            <Link href={props.href} passHref>
              <CardActionArea focusRipple href={props.href}>
                {cardClickable}
              </CardActionArea>
            </Link>
          )}
        </Card>
      </div>
    </div>
  );
}

export const navigatorCards: INavigatorCardProps[] = [
  {
    title: "Recipes and meal planner",
    description:
      "My regular recipes, with ingredients, method, and search functionality. Meal planning only available on large screen sizes",
    imageSrc: "/images/ChilliConCarne.jpg",
    href: "/food",
  },
  {
    title: "Plants",
    description: "My plants, images and optimal conditions.",
    imageSrc: "/images/plants.jpg",
    href: "/plants",
  },
  {
    title: "3D Printing",
    description: "Some models I have printed.",
    imageSrc: "/images/printing.jpg",
    href: "/printing",
  },
  {
    title: "Meal Plan",
    description: "Mobile available meal plan created from meal planner.",
    imageSrc: "/images/food.jpg",
    href: "/meal_plan",
  },
  {
    title: "Library",
    description: "All the books I own, and what I rate them.",
    imageSrc: "/images/bookshelf.jpg",
    href: "/bookshelf",
    disabled: true,
  },
  {
    title: "Path Finder",
    description: "Visualization of path finding algorithms.",
    imageSrc: "/images/path-finder.jpg",
    href: "/path_finder",
    disabled: true,
  },
];
