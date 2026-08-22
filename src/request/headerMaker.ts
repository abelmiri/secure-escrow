import LOCAL_STORAGE_VALUES from "@/constants/storage/LOCAL_STORAGE_VALUES"
import decodeJWT from "@/helpers/auth/decodeJWT"
import getToken from "@/request/getToken"

const getRequestUsername = () => {
  const temporaryUsername =
    process.env.NEXT_PUBLIC_DEV_USER || process.env.DEV_USER

  if (temporaryUsername) return temporaryUsername

  if (typeof window !== "undefined") {
    const stateUsername = window.authState?.user?.username
    if (stateUsername) return stateUsername

    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_VALUES.ACCOUNT.user)
      if (storedUser) {
        const username = (JSON.parse(storedUser) as { username?: string })
          .username
        if (username) return username
      }
    } catch {
      // Ignore stale or invalid persisted profile data.
    }
  }

  const token = getToken({ withoutTokenType: true })
  const tokenPayload = token ? decodeJWT(token) : null

  return (
    tokenPayload?.preferred_username ||
    tokenPayload?.username
  )
}

function headerMaker({ headers }: { headers?: Record<string, string> } = {}) {
  const username = getRequestUsername()
  const requestHeaders: Record<string, string> = {
    "Accept-Language": "fa",
  }

  if (username) {
    requestHeaders["X-Dev-User"] = username
  }

  return {
    ...requestHeaders,
    ...(headers ? headers : {}),
  }
}

export default headerMaker
