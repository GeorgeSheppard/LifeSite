import Layout, { ILayoutProps } from "../components/layout";

export interface IMyLifeProps {
  Component: React.JSXElementConstructor<ILayoutProps>;
  pageProps: ILayoutProps;
}

export default function MyLife(props: IMyLifeProps) {
  const { Component } = props;

  return (
    <Layout>
      <Component {...props.pageProps} />
    </Layout>
  );
}
