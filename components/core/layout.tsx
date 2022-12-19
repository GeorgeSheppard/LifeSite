import CssBaseline from "@mui/material/CssBaseline";
import Header from "./header";

export interface ILayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: ILayoutProps) {
  return (
    <>
      <CssBaseline />
      <Header />
      {props.children}
    </>
  );
}
