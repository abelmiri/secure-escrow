"use client"

import type { AuthActionType, AuthStateType } from "@/context/auth/AuthType"
import authActions from "@/context/auth/authActions"
import authReducer, { authInit } from "@/context/auth/authReducer"
import loginOAUTH, { getTokenAfterRedirect } from "@/helpers/auth/loginOAUTH"
import getToken from "@/request/getToken"
import parseQueryString from "@/helpers/query-param/parseQueryString"
import resetDataManager from "@/helpers/storage/resetDataManager"
import { Box, Button, Typography } from "@mui/material"
import {
  createContext,
  type Dispatch,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react"

export const authContext = createContext<{
  authState: AuthStateType
  authDispatch: Dispatch<AuthActionType>
  // @ts-expect-error "shit"
}>(null)

function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, authDispatch] = useReducer(
    authReducer,
    authInit({ isReset: false }),
  )
  const [isAuthenticatingCode, setIsAuthenticatingCode] = useState<
    false | string
  >(setInitialIsAuthenticating)
  const cancelToken = useRef<AbortController>(null)
  const authStartedRef = useRef(false)
  const hadAuthCodeOnMount = useRef(Boolean(isAuthenticatingCode))
  const [authError, setAuthError] = useState(false)

  function setInitialIsAuthenticating() {
    const { code } = parseQueryString()
    return !authState.user && typeof code === "string" ? code : false
  }

  useEffect(() => {
    if (!isAuthenticatingCode || authStartedRef.current) return
    authStartedRef.current = true

    if (window.opener) {
      window.opener.postMessage(
        { code: isAuthenticatingCode },
        window.location.origin,
      )
      window.close()
      return
    }

    void getTokenAfterRedirect({
      code: isAuthenticatingCode,
      authDispatch,
    })
      .catch(async () => {
        // A callback URL can remain open after the code was already exchanged.
        // In that case the session cookie is the source of truth.
        if (getToken() || getToken({ useRefreshToken: true })) {
          try {
            await authActions.getProfile({ authDispatch, cancelToken })
            return
          } catch {
            // Show a recoverable error below if the saved session is invalid.
          }
        }
        setAuthError(true)
        authDispatch({
          type: "SET_GETTING_USER",
          payload: { isLoading: false },
        })
      })
      .finally(() => {
        const url = new URL(window.location.href)
        for (const key of ["code", "state", "session_state", "iss"]) {
          url.searchParams.delete(key)
        }
        window.history.replaceState(
          window.history.state,
          "",
          `${url.pathname}${url.search}${url.hash}`,
        )
        setIsAuthenticatingCode(false)
      })
  }, [isAuthenticatingCode, authDispatch])

  useEffect(() => {
    if (hadAuthCodeOnMount.current) return
    if (!getToken() && !getToken({ useRefreshToken: true })) return
    void authActions.getProfile({ authDispatch, cancelToken }).catch(() => {
      setAuthError(true)
    })
  }, [])

  useLayoutEffect(() => {
    // Required by the popup OAuth flow. Profile data is not exposed globally.
    window.authDispatch = authDispatch
  }, [authDispatch])

  useEffect(() => {
    function onResetData({
      detail: { isAfterLogin },
    }: {
      detail: { isAfterLogin: boolean }
    }) {
      cancelToken?.current?.abort?.("CANCEL")
      authDispatch({ type: "RESET_DATA", payload: { isAfterLogin } })
    }

    resetDataManager.setResetDataListener({ callBack: onResetData })
  }, [])

  return (
    <authContext.Provider value={{ authState, authDispatch }}>
      {/*{(authState?.isLoading || isAuthenticatingCode) && <LoadingWrapper isFixed />}*/}
      {authError ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          gap={2}
          dir="rtl"
        >
          <Typography>ورود کامل نشد. لطفاً دوباره تلاش کنید.</Typography>
          <Button
            variant="contained"
            onClick={() => loginOAUTH({ redirect: true })}
          >
            تلاش دوباره
          </Button>
        </Box>
      ) : !isAuthenticatingCode ? (
        children
      ) : null}
    </authContext.Provider>
  )
}

export default AuthProvider
