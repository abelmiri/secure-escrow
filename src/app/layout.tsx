import type { Metadata } from "next";

import "./globals.css";

import MuiThemeProvider from "./MuiThemeProvider";

export const metadata: Metadata = {
  title: "My Material App",
  description: "Next.js + TypeScript + MUI design system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MuiThemeProvider>{children}</MuiThemeProvider>
      </body>
    </html>
  );
}
