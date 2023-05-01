import Header from "./header";

export interface ILayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: ILayoutProps) {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
}
