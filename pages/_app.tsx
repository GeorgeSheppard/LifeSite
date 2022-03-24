import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import Layout, { ILayoutProps } from "../components/core/layout";
import { store } from "../store/store";
import { ThemeController } from "../components/core/theme";
import "../styles/global_card.scss";

export interface IMyLifeProps {
  Component: React.JSXElementConstructor<ILayoutProps>;
  pageProps: ILayoutProps & { session: Session };
}

export default function MyLife(props: IMyLifeProps) {
  const { Component } = props;
  const { session, ...pageProps } = props.pageProps;

  return (
    <Provider store={store}>
      <ThemeController>
        <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </ThemeController>
    </Provider>
  );
}
