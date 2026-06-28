import COOKIE_VALUES from "@/constants/storage/COOKIE_VALUES"
import type { LoginType } from "@/context/auth/AuthType"
import cookieHelper from "@/helpers/storage/cookieHelper"

export default function storeAuthTokens(tokens: LoginType) {
  const { access_token, refresh_token, id_token, token_type, expires_in } =
    tokens

  cookieHelper.setItem(
    COOKIE_VALUES.ACCOUNT.token,
    `${token_type} ${access_token}`,
  )
  cookieHelper.setItem(COOKIE_VALUES.ACCOUNT.refresh_token, refresh_token)

  if (id_token) {
    cookieHelper.setItem(COOKIE_VALUES.ACCOUNT.id_token, id_token)
  }

  cookieHelper.setItem(
    COOKIE_VALUES.ACCOUNT.token_expires_in,
    new Date(Date.now() + expires_in * 1000).toString(),
  )
}
