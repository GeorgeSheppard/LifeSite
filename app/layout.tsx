import "../styles/globals.css";
import "../styles/global_card.css";
import "../styles/scrollbar.css";
import "../styles/utilities.css";
import "../styles/padding.css";
import 'tailwindcss/tailwind.css'
import * as Sentry from '@sentry/nextjs';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { RootLayout } from "./ClientLayout";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export function generateMetadata(): Metadata {
  return {
    other: {
      ...Sentry.getTraceData()
    }
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout className={roboto.className}>{children as React.ReactElement}</RootLayout>;
}