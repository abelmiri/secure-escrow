import type { Metadata } from "next"

import "./globals.css"

import MuiThemeProvider from "./MuiThemeProvider"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import { ReactNode } from "react"
import AuthProvider from "@/context/auth/authProvider"

export const metadata: Metadata = {
  title: "۲۶۲۳۳۳۰۱۹",
  description: "امان یار - مورد اعتمادترین",
  other: {
    enamad: "۲۶۲۳۳۳۰۱۹",
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
