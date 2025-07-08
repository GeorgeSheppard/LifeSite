'use client';

import { CssBaseline } from "@mui/material";
import * as React from "react";
import { ClientProviders } from "./providers/client-providers";


export function RootLayout({
    children,
}: {
    children: React.ReactElement;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
                    rel="stylesheet" />
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
