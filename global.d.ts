import type {AuthActionType, AuthStateType} from "context/auth/AuthType"
import type {Dispatch} from "react"

declare global {
    interface Window {
        authState?: AuthStateType
        authDispatch?: Dispatch<AuthActionType>

        resetData?: (props: { isAfterLogin: boolean }) => void
    }
}
