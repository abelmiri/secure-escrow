import COOKIE_VALUES from "@/constants/storage/COOKIE_VALUES"
import LOCAL_STORAGE_VALUES from "@/constants/storage/LOCAL_STORAGE_VALUES"
import type { AuthActionType, AuthStateType } from "@/context/auth/AuthType"
import clearLocalStorage from "@/helpers/storage/clearLocalStorage"
import cookieHelper from "@/helpers/storage/cookieHelper"

const initialState: AuthStateType = {
  isLoading: true,
  user: null,
  partnerProfiles: [],
}

export function authInit({ isReset }: { isReset: boolean }) {
  if (isReset) {
    return { ...initialState, isLoading: false }
  } else {
    if (typeof window !== "undefined") {
      // Remove profile data persisted by older app versions.
      localStorage.removeItem("user")
      localStorage.removeItem("partner_profiles")

      const token = cookieHelper.getItem(COOKIE_VALUES.ACCOUNT.token)
      const refresh_token = cookieHelper.getItem(
        COOKIE_VALUES.ACCOUNT.refresh_token,
      )
      if (token || refresh_token) {
        // Profile data is intentionally kept out of browser storage and fetched
        // again when an authenticated session is restored.
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
    case "SET_PARTNER_PROFILES": {
      const { partnerProfiles } = action.payload
      return { ...state, partnerProfiles }
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
