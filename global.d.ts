import type { AuthActionType } from "context/auth/AuthType"
import type { Dispatch } from "react"

declare global {
  interface Window {
    authDispatch?: Dispatch<AuthActionType>
    resetData?: (props: { isAfterLogin: boolean }) => void
  }
}
