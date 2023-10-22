import Header from "./header";

export interface ILayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: ILayoutProps) {
  return (
    <div style={{backgroundColor: 'rgba(200, 200, 200, 0.47)'}}>
      <Header />
      {props.children}
    </div>
  );
}
