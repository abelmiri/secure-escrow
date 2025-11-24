import type { Metadata } from "next";

import "./globals.css";

import MuiThemeProvider from "./MuiThemeProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "My Material App",
  description: "Next.js + TypeScript + MUI design system",
  themeColor: "#8200DB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MuiThemeProvider>
          <Header />
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
