import "../styles/globals.css";
import "../styles/global_card.css";
import "../styles/scrollbar.css";
import "../styles/utilities.css";
import "../styles/padding.css";
import 'tailwindcss/tailwind.css'
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import * as React from "react";
import Layout, { ILayoutProps } from "../components/core/layout";
import { ThemeController } from "../components/core/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StyledEngineProvider } from "@mui/material/styles";
import { trpc } from "../client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      structuralSharing: false,
    },
  },
});

export interface IKitchenCalmProps {
  Component: React.JSXElementConstructor<ILayoutProps>;
  pageProps: ILayoutProps & { session: Session };
}

function KitchenCalm(props: IKitchenCalmProps) {
  const { Component } = props;
  const { session, ...pageProps } = props.pageProps;

  return (
    <StyledEngineProvider injectFirst>
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
    </StyledEngineProvider>
  );
}

export default trpc.withTRPC(KitchenCalm)