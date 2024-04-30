import { Inter } from "next/font/google";
import "./globals.css";
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
