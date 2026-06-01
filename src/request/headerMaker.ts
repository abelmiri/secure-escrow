import getToken from "@/request/getToken"
import decodeJWT from "@/helpers/auth/decodeJWT"

function headerMaker({ headers }: { headers?: Record<string, string> } = {}) {
  const token = getToken()
  const rawToken = getToken({ withoutTokenType: true })
  const decodedToken = rawToken ? decodeJWT(rawToken) : null

  const gatewayHeaders: Record<string, string> = {}

  // if (decodedToken) {
  //   if (decodedToken.sub) {
  //     gatewayHeaders["X-USER-ID"] = decodedToken.sub
  //   }
  //   if (decodedToken.preferred_username) {
  //     gatewayHeaders["X-USERNAME"] = decodedToken.preferred_username
  //   }
  // }

  return {
    ...(token ? { Authorization: token } : {}),
    ...gatewayHeaders,
    "Accept-Language": "fa",
    ...(headers ? headers : {}),
  }
}

export default headerMaker
