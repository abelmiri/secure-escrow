import type { ProfileUpdatePayload } from "@/context/auth/AuthType"
import authActions from "@/context/auth/authActions"
import { authContext } from "@/context/auth/authProvider"
import { type RefObject, use } from "react"

interface UpdateUserProps {
  data: ProfileUpdatePayload
  cancelToken?: RefObject<AbortController | null>
  progress?: (progress: number) => void
  dontToast?: boolean
}

function useUser() {
  const { authState, authDispatch } = use(authContext) || {}
  const { user, partnerProfiles = [] } = authState || {}
  const isLoggedIn = !!user

  function updateUser({
    data,
    cancelToken,
    progress,
    dontToast,
  }: UpdateUserProps) {
    return authActions.updateUser({
      data,
      cancelToken,
      authDispatch,
      progress,
      dontToast,
    })
  }

  return {
    user,
    partnerProfiles,
    isLoggedIn,
    updateUser,
    authDispatch,
    authState,
  }
}

export default useUser
