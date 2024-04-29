import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { FiChevronLeft } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthSession } from "./protected";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function App({ children }: PropsWithChildren) {
  return (
    <html>
      <body className={inter.className}>
        <AuthSession>{children}</AuthSession>
      </body>
    </html>
  );
}

export const Layout = ({ children, title }: Readonly<{ title: string; children: React.ReactNode }>) => (
  <div className="container">
    <div className="header">
      <div className="flex text-align-left">
        <Link href="/">
          <FiChevronLeft />
        </Link>
      </div>
      <div className="flex text-align-center">{title}</div>
      <div className="flex"></div>
    </div>
    <div className="content">{children}</div>
  </div>
);
