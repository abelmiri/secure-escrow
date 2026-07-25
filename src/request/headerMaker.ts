import getToken from "@/request/getToken"

const devPhases = new Set(["developement", "development"])

const isDevUserPhase = () => {
  const phase = process.env.NEXT_PUBLIC_PHASE || process.env.PHASE

  return phase ? devPhases.has(phase.toLowerCase()) : false
}

const getDevUser = () =>
  process.env.NEXT_PUBLIC_DEV_USER || process.env.DEV_USER

function headerMaker({ headers }: { headers?: Record<string, string> } = {}) {
  const shouldUseDevUser = isDevUserPhase()
  const token = shouldUseDevUser ? "" : getToken()
  const devUser = getDevUser()
  const requestHeaders: Record<string, string> = {
    "Accept-Language": "fa",
  }

  if (token) {
    requestHeaders.Authorization = token
  }

  if (shouldUseDevUser && devUser) {
    requestHeaders["X-Dev-User"] = devUser
  }

  return {
    ...requestHeaders,
    ...(headers ? headers : {}),
  }
}

export default headerMaker
