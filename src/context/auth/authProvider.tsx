"use client"

import type { AuthActionType, AuthStateType } from "@/context/auth/AuthType"
import authActions from "@/context/auth/authActions"
import authReducer, { authInit } from "@/context/auth/authReducer"
import { getTokenAfterRedirect } from "@/helpers/auth/loginOAUTH"
import parseQueryString from "@/helpers/query-param/parseQueryString"
import resetDataManager from "@/helpers/storage/resetDataManager"
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

  function setInitialIsAuthenticating() {
    const { code, session_state, iss } = parseQueryString()
    return !authState.user &&
      code &&
      typeof code === "string" &&
      session_state &&
      iss
      ? code
      : false
  }

  useEffect(() => {
    if (isAuthenticatingCode) {
      if (window.opener) {
        window.opener.postMessage(
          { code: isAuthenticatingCode },
          window.location.origin,
        )
        window.close()
      } else {
        // probably, deep link from TWA got the redirect, or regular comeback from SSO
        getTokenAfterRedirect({
          code: isAuthenticatingCode,
          authDispatch,
        }).then(() => setIsAuthenticatingCode(false))
      }
    }
  }, [])

  useEffect(() => {
    if (authState?.user) {
      authActions.getProfile({ authDispatch, cancelToken })
    }
  }, [])

  useLayoutEffect(() => {
    window.authState = authState
    window.authDispatch = authDispatch
  }, [authState])

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
      {!isAuthenticatingCode && children}
    </authContext.Provider>
  )
}

export default AuthProvider
