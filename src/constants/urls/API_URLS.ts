import OAUTH from "@/constants/auth/OAUTH"
import createQueryString from "@/helpers/query-param/createQueryString"

const API_URLS = {
  login: ({
    redirectUrl,
    codeChallenge,
    state,
  }: {
    redirectUrl: string
    codeChallenge: string
    state: string
  }) =>
    `realms/${OAUTH.REALMS}/protocol/openid-connect/auth${createQueryString({ params: { response_type: "code", client_id: OAUTH.CLIENT_ID, scope: "openid", redirect_uri: redirectUrl, state, code_challenge: codeChallenge, code_challenge_method: "S256" } })}`,

  getToken: `realms/${OAUTH.REALMS}/protocol/openid-connect/token`,
  logout: `realms/${OAUTH.REALMS}/protocol/openid-connect/logout`,

  province: "v1/base/province",
  city: ({ id }: { id: number }) =>
    `v1/base/province/${id}/city`,
  profile: "v1/auth/profile",
  deals: "v1/deals/u",
  categories: "v1/deals/categories",
  subCategories: ({ id }: { id: number }) =>
    `v1/deals/categories/sub-category/${id}`,
  dealsImage: ({ id }: { id: number }) =>
    `v1/deals/items/${id}/gallery`,
}

export default API_URLS
