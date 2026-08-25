import getToken from "@/request/getToken"

function headerMaker({ headers }: { headers?: Record<string, string> } = {}) {
  const token = getToken()
  const requestHeaders: Record<string, string> = {
    "Accept-Language": "fa",
  }

  if (token) {
    requestHeaders.Authorization = token
  }

  return {
    ...requestHeaders,
    ...(headers ? headers : {}),
  }
}

export default headerMaker
