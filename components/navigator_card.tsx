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
      <CardMedia src={props.imageSrc} component="img" />
      <CardContent className={"content"}>
        <Typography>{props.description}</Typography>
      </CardContent>
    </Card>
  );
}
