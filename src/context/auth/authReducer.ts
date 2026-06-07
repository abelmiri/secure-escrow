import COOKIE_VALUES from "@/constants/storage/COOKIE_VALUES"
import LOCAL_STORAGE_VALUES from "@/constants/storage/LOCAL_STORAGE_VALUES"
import type { AuthActionType, AuthStateType } from "@/context/auth/AuthType"
import clearLocalStorage from "@/helpers/storage/clearLocalStorage"
import cookieHelper from "@/helpers/storage/cookieHelper"

const initialState: AuthStateType = { isLoading: true, user: null }

export function authInit({ isReset }: { isReset: boolean }) {
  if (isReset) {
    return { ...initialState, isLoading: false }
  } else {
    if (typeof window !== "undefined") {
      const token = cookieHelper.getItem(COOKIE_VALUES.ACCOUNT.token)
      const refresh_token = cookieHelper.getItem(
        COOKIE_VALUES.ACCOUNT.refresh_token,
      )
      const user = localStorage.getItem(LOCAL_STORAGE_VALUES.ACCOUNT.user)
      if (token && refresh_token && user) {
        try {
          return { ...initialState, user: JSON.parse(user), isLoading: true }
        } catch (_) {
          return { ...initialState, isLoading: false }
        }
      } else if (token || refresh_token) {
        // If we have tokens but no user data yet, we should be in loading state
        return { ...initialState, isLoading: true }
      } else {
        // No tokens found, not loading anymore
        return { ...initialState, isLoading: false }
      }
    } else {
      // Server side, keep loading true to prevent flash of NotFound
      return initialState
    }
  }
}

function authReducer(
  state: AuthStateType = initialState,
  action: AuthActionType,
): AuthStateType {
  switch (action.type) {
    case "SET_USER": {
      const { user } = action.payload
      return { ...state, user, isLoading: false }
    }
    case "RESET_DATA": {
      const { isAfterLogin } = action.payload
      clearLocalStorage({
        exceptKeys: isAfterLogin
          ? [
              ...Object.values(LOCAL_STORAGE_VALUES.ACCOUNT),
              ...Object.values(LOCAL_STORAGE_VALUES.DEVICE),
            ]
          : Object.values(LOCAL_STORAGE_VALUES.DEVICE),
      })
      if (!isAfterLogin) {
        Object.values(COOKIE_VALUES.ACCOUNT).forEach((key) => {
          cookieHelper.removeItem(key)
        })
      }
      return isAfterLogin ? state : authInit({ isReset: true })
    }
    case "SET_GETTING_USER": {
      const { isLoading } = action.payload
      return { ...state, isLoading }
    }
    default: {
      throw new Error()
    }
  }
}

export default authReducer
