import type { Metadata } from "next"

import "./globals.css"

import MuiThemeProvider from "./MuiThemeProvider"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import { ReactNode } from "react"
import AuthProvider from "@/context/auth/authProvider"
import { DOMAIN_URL } from "@/constants/urls/SERVER_URLS"

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
  // Temporary title for Enamad domain verification. Restore after approval.
  title: "14897288",
  description: "امان یار - مورد اعتمادترین",
  other: {
    enamad: "14897288",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body suppressHydrationWarning>
        <MuiThemeProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </MuiThemeProvider>
      </body>
    </html>
  )
}
