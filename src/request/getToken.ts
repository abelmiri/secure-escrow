import COOKIE_VALUES from "@/constants/storage/COOKIE_VALUES"
import cookieHelper from "@/helpers/storage/cookieHelper"

function getToken({
  useRefreshToken,
  useIdToken,
  withoutTokenType,
}: {
  useRefreshToken?: boolean
  useIdToken?: boolean
  withoutTokenType?: boolean
} = {}) {
  const tokenKey = useIdToken
    ? COOKIE_VALUES.ACCOUNT.id_token
    : useRefreshToken
      ? COOKIE_VALUES.ACCOUNT.refresh_token
      : COOKIE_VALUES.ACCOUNT.token
  const token = cookieHelper.getItem(tokenKey)

  return withoutTokenType && token ? token.split(" ")[1] : token
}

export default getToken
