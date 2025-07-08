'use client';

import { CssBaseline } from "@mui/material";
import * as React from "react";
import { ClientProviders } from "./providers/client-providers";


export function RootLayout({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <html lang="en" className={className}>
            <body>
                <CssBaseline />
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
