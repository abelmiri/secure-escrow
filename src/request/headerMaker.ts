import getToken from "@/request/getToken"

function headerMaker({ headers }: { headers?: Record<string, string> } = {}) {
  const isDevelopment = process.env.PHASE === "developement"
  const requestHeaders: Record<string, string> = {
    "Accept-Language": "fa",
  }

  if (isDevelopment) {
    const devUser = process.env.DEV_USER

    if (devUser) {
      requestHeaders["X-Dev-User"] = devUser
    }
  } else {
    const token = getToken()

    if (token) {
      requestHeaders.Authorization = token
    }
  }

  return {
    ...requestHeaders,
    ...(headers ? headers : {}),
  }
}

export default headerMaker
