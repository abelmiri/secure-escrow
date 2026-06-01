import type { UpdateUserType } from "@/context/auth/AuthType"
import authActions from "@/context/auth/authActions"
import { authContext } from "@/context/auth/authProvider"
import { type RefObject, use } from "react"

interface UpdateUserProps {
  data: Partial<UpdateUserType>
  cancelToken?: RefObject<AbortController | null>
  progress?: (progress: number) => void
}

function useUser() {
  const { authState, authDispatch } = use(authContext) || {}
  const { user } = authState || {}
  const isLoggedIn = !!user

  function updateUser({ data, cancelToken, progress }: UpdateUserProps) {
    return authActions.updateUser({ data, cancelToken, authDispatch, progress })
  }

  return { user, isLoggedIn, updateUser, authDispatch, authState }
}

export default useUser
