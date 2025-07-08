'use client';

import "../styles/globals.css";
import "../styles/global_card.css";
import "../styles/scrollbar.css";
import "../styles/utilities.css";
import "../styles/padding.css";
import 'tailwindcss/tailwind.css'
import * as React from "react";
import { ClientProviders } from "./providers/client-providers";
import CssBaseline from "@mui/material/CssBaseline";

export default function RootLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CssBaseline />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
} 