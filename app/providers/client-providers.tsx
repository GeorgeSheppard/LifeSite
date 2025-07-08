'use client';

import { SessionProvider } from "next-auth/react";
import Layout from "../../components/core/layout";
import { ThemeController } from "../../components/core/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { StyledEngineProvider } from "@mui/material/styles";
import { TrpcProvider } from "./trpc-provider";

export function ClientProviders({ children }: { children: React.ReactElement }) {
  return (
    <TrpcProvider>
      <StyledEngineProvider injectFirst>
        <DndProvider backend={HTML5Backend}>
          <ThemeController>
            <SessionProvider>
              <Layout>
                {children}
              </Layout>
            </SessionProvider>
          </ThemeController>
        </DndProvider>
      </StyledEngineProvider>
    </TrpcProvider>
  );
} 