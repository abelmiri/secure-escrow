"use client"

import { ReactNode } from "react"

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"

const baseFontStack = [
  "Yekan",
  "Arial",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "sans-serif",
].join(",")

const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  typography: {
    fontFamily: baseFontStack,
    allVariants: {
      fontFamily: baseFontStack,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontFamily: baseFontStack,
        },
        body: {
          fontFamily: baseFontStack,
        },
      },
    },
  },
})

import { SnackbarProvider } from "notistack"
import ToastRegistry from "@/components/ToastRegistry/ToastRegistry"

type Props = {
  children: ReactNode
}

export default function MuiThemeProvider({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <ToastRegistry />
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  )
}
