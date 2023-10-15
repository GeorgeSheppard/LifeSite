import Header from "./header";

export interface ILayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: ILayoutProps) {
  return (
    <div style={{backgroundColor: '#eee'}}>
      <Header />
      {props.children}
    </div>
  );
}
