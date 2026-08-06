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
  city: ({ id }: { id: number }) => `v1/base/province/${id}/city`,
  profile: "v1/auth/profile",
  dashboardStats: "v1/deals/dashboard-stats",
  deals: "v1/deals/u",
  deal: ({ id }: { id: number }) => `v1/deals/u/${id}`,
  dealWorkflowActions: ({ id }: { id: number }) =>
    `v1/deals/u/${id}/workflow-actions`,
  dealWorkflowActionDetails: ({
    id,
    transitionId,
  }: {
    id: number
    transitionId: number
  }) =>
    `v1/deals/u/${id}/workflow-actions/details?transition_id=${transitionId}`,
  dealContractPdf: ({ id }: { id: number }) => `v1/deals/u/${id}/contract-pdf`,
  dealDocuments: ({ id }: { id: number }) =>
    `v1/documents/deals/${id}/documents`,
  dealMessages: ({ id }: { id: number }) => `v1/chat/deals/${id}/messages`,
  dealMessagesPoll: ({
    id,
    afterId,
  }: {
    id: number
    afterId: string | number
  }) =>
    `v1/chat/deals/${id}/messages/poll?after_id=${encodeURIComponent(afterId)}`,
  dealMessageSend: ({ id }: { id: number }) => `v1/chat/deals/${id}/send`,
  categories: "v1/deals/categories",
  subCategories: ({ id }: { id: number }) =>
    `v1/deals/categories/sub-category/${id}`,
  documentRequirements: ({ id }: { id: number }) =>
    `v1/documents/sub-category/${id}/document-requirements`,
  documentUpload: () => `v1/documents/upload`,
  partnershipRequest: "v1/partners/request",
  partnerProfile: ({ brokerId }: { brokerId: string | number }) =>
    `v1/partners/${brokerId}/profile`,
}

export default API_URLS
