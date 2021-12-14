import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "../styles/navigator_card.module.scss";

export interface INavigatorCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

export default function NavigatorCard(props: INavigatorCardProps) {
  return (
    <Card className={"navigatorCard"}>
      <CardHeader title={props.title} />
      <CardMedia src={props.imageSrc} component="img" height="300px" />
      {/* TODO: All cards expand to be the size of the maximum card on that row */}
      <CardContent className={"content"}>
        <Typography>{props.description}</Typography>
      </CardContent>
    </Card>
  );
}

const fillerCard: INavigatorCardProps = {
  title: "Title",
  description: "Here is a reasonable length description",
  imageSrc: "/images/landscape.jfif",
};

export const navigatorCards: INavigatorCardProps[] = [
  {
    title: "Plants",
    description: "Plant management, info on my plants, and watering reminders.",
    imageSrc: "/images/plants.jpg",
  },
  {
    title: "Food",
    description: "Recipe management, and shopping list creator.",
    imageSrc: "/images/food.jpg",
  },
  {
    title: "3D Printing",
    description: "Things I would like to print at some point.",
    imageSrc: "/images/printing.jpg",
  },
  {
    title: "Library",
    description: "All the books I own, and what I rate them.",
    imageSrc: "/images/bookshelf.jpg",
  },
  {
    title: "Path Finder",
    description: "Visualization of path finding algorithms.",
    imageSrc: "/images/path-finder.jpg",
  },
  fillerCard,
  fillerCard,
  fillerCard,
  fillerCard,
];
