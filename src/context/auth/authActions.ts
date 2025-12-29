import OAUTH from "@/constants/auth/OAUTH"
import API_URLS from "@/constants/urls/API_URLS"
import COOKIE_VALUES from "@/constants/storage/COOKIE_VALUES"
import LOCAL_STORAGE_VALUES from "@/constants/storage/LOCAL_STORAGE_VALUES"
import type {
  LoginType,
  SetUserActionType,
  UpdateUserType,
  UserType,
} from "@/context/auth/AuthType"
import cookieHelper from "@/helpers/storage/cookieHelper"
import resetDataManager from "@/helpers/storage/resetDataManager"
import type { Dispatch, RefObject } from "react"
import getToken from "@/request/getToken"
import request from "@/request/request"

function getProfile({
  authDispatch,
  cancelToken,
}: {
  authDispatch: Dispatch<SetUserActionType>
  cancelToken?: RefObject<AbortController | null>
}) {
  return request
    .get({ url: API_URLS.profile, cancelToken, dontToast: true })
    .then((user: UserType) => {
      setUser({ data: { user }, authDispatch })
    })
}

function updateUser({
  data,
  cancelToken,
  authDispatch,
}: {
  data: Partial<UpdateUserType>
  cancelToken?: RefObject<AbortController | null>
  authDispatch: Dispatch<SetUserActionType>
}) {
  return request
    .patch({ url: API_URLS.profile, data, cancelToken })
    .then((user: UserType) => {
      setUser({ data: { user }, authDispatch })
    })
}

function setUser({
  data: { user },
  authDispatch,
}: {
  data: { user: UserType }
  authDispatch: Dispatch<SetUserActionType>
}) {
  localStorage.setItem(LOCAL_STORAGE_VALUES.ACCOUNT.user, JSON.stringify(user))
  authDispatch({ type: "SET_USER", payload: { user } })
}

function _setCookies({ res }: { res: LoginType }) {
  const { access_token, refresh_token, token_type, expires_in } = res
  cookieHelper.setItem(
    COOKIE_VALUES.ACCOUNT.token,
    `${token_type} ${access_token}`,
  )
  cookieHelper.setItem(COOKIE_VALUES.ACCOUNT.refresh_token, refresh_token)
  cookieHelper.setItem(
    COOKIE_VALUES.ACCOUNT.token_expires_in,
    new Date(Date.now() + expires_in * 1000).toString(),
  )
}

function refreshToken() {
  const refresh_token = getToken({ useRefreshToken: true })
  const data = new URLSearchParams()
  data.append("refresh_token", refresh_token)
  data.append("client_id", OAUTH.CLIENT_ID)
  data.append("grant_type", "refresh_token")
  return new Promise((resolve, reject) => {
    request
      .post({
        data,
        url: API_URLS.getToken,
        subdomain: "oAuth",
        dontToast: true,
      })
      .then((res: LoginType) => {
        _setCookies({ res })
        resolve(null)
      })
      .catch((err: any) => {
        const refreshError = err?.status === 400
        if (refreshError) {
          reject(err)
        } else {
          resolve(null)
        }
      })
  })
}

function verifyOAUTH({
  data: { code, code_verifier, redirect_uri },
  authDispatch,
}: {
  data: { code: string; code_verifier: string; redirect_uri: string }
  authDispatch: Dispatch<SetUserActionType>
}) {
  const data = new URLSearchParams()
  data.append("grant_type", "authorization_code")
  data.append("code", code)
  data.append("code_verifier", code_verifier)
  data.append("redirect_uri", redirect_uri)
  data.append("client_id", OAUTH.CLIENT_ID)
  return request
    .post({ url: API_URLS.getToken, subdomain: "oAuth", data })
    .then((res) => {
      _setCookies({ res })

      return getProfile({ authDispatch })
        .then(() => {
          return resetDataManager.resetData({ isAfterLogin: true })
        })
        .catch((err) => {
          Object.values(COOKIE_VALUES.ACCOUNT).forEach((key) =>
            cookieHelper.removeItem(key),
          )
          throw err
        })
    })
}

function logout() {
  const data = new URLSearchParams()
  data.append("client_id", OAUTH.CLIENT_ID)
  data.append("refresh_token", getToken({ useRefreshToken: true }))
  return request.post({
    url: API_URLS.logout,
    subdomain: "oAuth",
    data,
    dontToast: true,
  })
}

const authActions = {
  getProfile,
  updateUser,
  setUser,
  refreshToken,
  verifyOAUTH,
  logout,
}

export default authActions
