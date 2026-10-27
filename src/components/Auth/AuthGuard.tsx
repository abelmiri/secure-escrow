"use client"

import { ReactNode, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getSelectedRepresentedPartner } from "@/helpers/auth/profileSelection"
import useUser from "@/context/auth/hooks/useUser"
import loginOAUTH from "@/helpers/auth/loginOAUTH"
import { Box, CircularProgress } from "@mui/material"

interface AuthGuardProps {
  children: ReactNode
  skipProfileSelection?: boolean
}

const profileSelectionPath = "/profile/select"

export default function AuthGuard({
  children,
  skipProfileSelection = false,
}: AuthGuardProps) {
  const { user, isLoggedIn, authState } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const hasStartedLogin = useRef(false)
  const selectedRepresentedPartner = getSelectedRepresentedPartner()
  const hasValidProfileSelection =
    selectedRepresentedPartner?.type === "personal" ||
    (selectedRepresentedPartner?.type === "partner" &&
      user?.represented_partners?.some(
        (partner) =>
          String(partner.id) === String(selectedRepresentedPartner.id),
      ))
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

  const shouldSelectProfile =
    typeof window !== "undefined" &&
    isLoggedIn &&
    !skipProfileSelection &&
    pathname !== profileSelectionPath &&
    Array.isArray(user?.represented_partners) &&
    user.represented_partners.length > 0 &&
    !hasValidProfileSelection

  useEffect(() => {
    if (shouldSelectProfile) {
      const search = new URLSearchParams(window.location.search)
      for (const key of ["code", "state", "session_state", "iss"]) {
        search.delete(key)
      }
      const query = search.toString()
      const returnTo = `${window.location.pathname}${query ? `?${query}` : ""}`
      router.replace(
        `${profileSelectionPath}?returnTo=${encodeURIComponent(returnTo)}`,
      )
    }
  }, [router, shouldSelectProfile])

  // Keep protected content hidden while authentication or redirect is pending.
  if (!isLoggedIn || shouldSelectProfile) {
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
