import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { PropsWithChildren } from "react";
import Head from "next/head";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "WE",
  description: "WE",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({ subsets: ["latin"] });

export default function App({ children }: PropsWithChildren) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
