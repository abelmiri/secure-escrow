import COOKIE_VALUES from "@/constants/storage/COOKIE_VALUES"
import cookieHelper from "@/helpers/storage/cookieHelper"

const TEMPORARY_DEV_COOKIE_KEYS = [
  COOKIE_VALUES.ACCOUNT.id_token,
  COOKIE_VALUES.ACCOUNT.token,
  COOKIE_VALUES.ACCOUNT.token_expires_in,
]

export default function initializeDevCookies() {
  if (process.env.NODE_ENV !== "development") return

  TEMPORARY_DEV_COOKIE_KEYS.forEach((key) => {
    if (!cookieHelper.getItem(key)) {
      cookieHelper.setItem(key, crypto.randomUUID())
    }
  })
}
