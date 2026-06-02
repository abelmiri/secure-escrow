"use client"

import { ReactNode } from "react"
import useUser from "@/context/auth/hooks/useUser"
import NotFound from "@/components/NotFound/NotFound"

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

  // Show nothing while checking authentication
  if (authState?.isLoading) {
    return null // Or a global loading spinner
  }

  // If not logged in, show the NotFound component instead of redirecting
  if (!isLoggedIn) {
    return <NotFound />
  }

  return <>{children}</>
}
