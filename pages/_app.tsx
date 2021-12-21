import { ThemeProvider } from "@mui/material/styles";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Layout, { ILayoutProps } from "../components/layout";
import { theme } from "./_theme";

export interface IMyLifeProps {
  Component: React.JSXElementConstructor<ILayoutProps>;
  pageProps: ILayoutProps & { session: Session };
}

export default function MyLife(props: IMyLifeProps) {
  const { Component } = props;
  const { session, ...pageProps } = props.pageProps;

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ThemeProvider>
  );
}
