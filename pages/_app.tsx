import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import * as React from "react";
import Layout, { ILayoutProps } from "../components/core/layout";
import { ThemeController } from "../components/core/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/global_card.scss";
import "../styles/scrollbar.scss";
import "../styles/utilities.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 24 * 1000,
    },
  },
});

export interface IMyLifeProps {
  Component: React.JSXElementConstructor<ILayoutProps>;
  pageProps: ILayoutProps & { session: Session };
}

export default function MyLife(props: IMyLifeProps) {
  const { Component } = props;
  const { session, ...pageProps } = props.pageProps;

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <DndProvider backend={HTML5Backend}>
        <ThemeController>
          <SessionProvider session={session}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
        </ThemeController>
      </DndProvider>
    </QueryClientProvider>
  );
}
