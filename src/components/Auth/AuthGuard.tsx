"use client"

import { ReactNode } from "react"
import useUser from "@/context/auth/hooks/useUser"
import NotFound from "@/components/NotFound/NotFound"
import { Box, CircularProgress } from "@mui/material"

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, authState } = useUser()
  // const isDev = process.env.NODE_ENV === "development"

  // If in development mode, bypass the safeguard
  // if (isDev) {
  //   return <>{children}</>
  // }

  // Show a loading spinner while checking authentication
  if (authState?.isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={40} sx={{ color: "var(--color-secondary)" }} />
      </Box>
    )
  }

  // If not logged in, show the NotFound component instead of redirecting
  if (!isLoggedIn) {
    return <NotFound />
  }

  return <>{children}</>
}
