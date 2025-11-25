import getToken from "@/request/getToken"

function headerMaker({ headers }: { headers?: Record<string, string> } = {}) {
  const token = getToken()
  return {
    ...(token ? { Authorization: token } : {}),
    "Accept-Language": "fa",
    ...(headers ? headers : {}),
  }
}

export default headerMaker
