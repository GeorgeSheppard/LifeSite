import { ThemeProvider } from "@mui/material/styles";
import Layout, { ILayoutProps } from "../components/layout";
import { theme } from "./_theme";

export interface IMyLifeProps {
  Component: React.JSXElementConstructor<ILayoutProps>;
  pageProps: ILayoutProps;
}

export default function MyLife(props: IMyLifeProps) {
  const { Component } = props;

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...props.pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
