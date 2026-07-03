"use client"

import { ReactNode, useEffect, useRef } from "react"
import useUser from "@/context/auth/hooks/useUser"
import loginOAUTH from "@/helpers/auth/loginOAUTH"
import { Box, CircularProgress } from "@mui/material"

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, authState } = useUser()
  const hasStartedLogin = useRef(false)
  // const isDev = process.env.NODE_ENV === "development"

  // If in development mode, bypass the safeguard
  // if (isDev) {
  //   return <>{children}</>
  // }

  useEffect(() => {
    if (!authState?.isLoading && !isLoggedIn && !hasStartedLogin.current) {
      hasStartedLogin.current = true
      loginOAUTH({ redirect: true })
    }
  }, [authState?.isLoading, isLoggedIn])

  // Keep protected content hidden while authentication or redirect is pending.
  if (authState?.isLoading || !isLoggedIn) {
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

  return <>{children}</>
}
