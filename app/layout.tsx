import "../styles/globals.css";
import "../styles/global_card.css";
import "../styles/scrollbar.css";
import "../styles/utilities.css";
import "../styles/padding.css";
import 'tailwindcss/tailwind.css'
import * as Sentry from '@sentry/nextjs';
import type { Metadata } from 'next';
import { RootLayout } from "./ClientLayout";

export function generateMetadata(): Metadata {
  return {
    other: {
      ...Sentry.getTraceData()
    }
  };
}

export default RootLayout;