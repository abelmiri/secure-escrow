import COOKIE_VALUES from "@/constants/storage/COOKIE_VALUES"
import cookieHelper from "@/helpers/storage/cookieHelper"

function getToken({useRefreshToken, withoutTokenType}: { useRefreshToken?: boolean; withoutTokenType?: boolean } = {}) {
    const token = cookieHelper.getItem(useRefreshToken ? COOKIE_VALUES.ACCOUNT.refresh_token : COOKIE_VALUES.ACCOUNT.token)
    return withoutTokenType && token ? token.split(" ")[1] : token
}

export default getToken
