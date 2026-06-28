import OAUTH from "@/constants/auth/OAUTH"
import API_URLS from "@/constants/urls/API_URLS"
import type { LoginType } from "@/context/auth/AuthType"
import storeAuthTokens from "@/helpers/auth/storeAuthTokens"
import getToken from "@/request/getToken"
import urlMaker from "@/request/urlMaker"

let refreshRequest: Promise<void> | null = null

export default function refreshAccessToken(): Promise<void> {
  if (refreshRequest) {
    return refreshRequest
  }

  const refreshToken = getToken({ useRefreshToken: true })

  if (!refreshToken) {
    return Promise.reject({ status: 401, data: "Refresh token is missing" })
  }

  const data = new URLSearchParams()
  data.append("grant_type", "refresh_token")
  data.append("refresh_token", refreshToken)
  data.append("client_id", OAUTH.CLIENT_ID)

  refreshRequest = fetch(
    urlMaker({ url: API_URLS.getToken, subdomain: "oAuth" }),
    {
      method: "POST",
      body: data,
      headers: {
        "Accept-Language": "fa",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
    .then(async (response) => {
      const contentType = response.headers.get("content-type")
      const isJson = contentType?.includes("application/json")
      const responseData = await response[isJson ? "json" : "text"]()

      if (!response.ok) {
        throw { status: response.status, data: responseData }
      }

      storeAuthTokens(responseData as LoginType)
    })
    .finally(() => {
      refreshRequest = null
    })

  return refreshRequest
}
