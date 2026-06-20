import OAUTH from "@/constants/auth/OAUTH"
import API_URLS from "@/constants/urls/API_URLS"
import COOKIE_VALUES from "@/constants/storage/COOKIE_VALUES"
import LOCAL_STORAGE_VALUES from "@/constants/storage/LOCAL_STORAGE_VALUES"
import type {
  AuthActionType,
  LoginType,
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
  authDispatch: Dispatch<AuthActionType>
  cancelToken?: RefObject<AbortController | null>
}) {
  authDispatch({ type: "SET_GETTING_USER", payload: { isLoading: true } })
  return request
    .get({ url: API_URLS.profile, cancelToken, dontToast: true })
    .then((user: UserType) => {
      setUser({ data: { user }, authDispatch })
    })
    .catch((err) => {
      authDispatch({ type: "SET_GETTING_USER", payload: { isLoading: false } })
      throw err
    })
}

function updateUser({
  data,
  cancelToken,
  authDispatch,
  progress,
}: {
  data: Partial<UpdateUserType>
  cancelToken?: RefObject<AbortController | null>
  authDispatch: Dispatch<AuthActionType>
  progress?: (progress: number) => void
}) {
  const isFormData = Object.values(data).some((value) => value instanceof File)

  if (isFormData) {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof UpdateUserType]
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value))
      }
    })

    return request
      .upload({
        url: API_URLS.profile,
        data: formData,
        cancelToken,
        method: "patch",
        progress,
        successMessage: "اطلاعات با موفقیت بروزرسانی شد",
        failMessage: "بروزرسانی اطلاعات با شکست مواجه شد",
      })
      .then((user: UserType) => {
        setUser({ data: { user }, authDispatch })
      })
  }

  return request
    .patch({
      url: API_URLS.profile,
      data,
      cancelToken,
      successMessage: "اطلاعات با موفقیت بروزرسانی شد",
      failMessage: "بروزرسانی اطلاعات با شکست مواجه شد",
    })
    .then((user: UserType) => {
      setUser({ data: { user }, authDispatch })
    })
}

function setUser({
  data: { user },
  authDispatch,
}: {
  data: { user: UserType }
  authDispatch: Dispatch<AuthActionType>
}) {
  localStorage.setItem(LOCAL_STORAGE_VALUES.ACCOUNT.user, JSON.stringify(user))
  authDispatch({ type: "SET_USER", payload: { user } })
}

function _setCookies({ res }: { res: LoginType }) {
  const { access_token, refresh_token, id_token, token_type, expires_in } = res
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
      .catch((err: unknown) => {
        const refreshError =
          typeof err === "object" &&
          err !== null &&
          "status" in err &&
          err.status === 400
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
  authDispatch: Dispatch<AuthActionType>
}) {
  const data = new URLSearchParams()
  data.append("grant_type", "authorization_code")
  data.append("code", code)
  data.append("code_verifier", code_verifier)
  data.append("redirect_uri", redirect_uri)
  data.append("client_id", OAUTH.CLIENT_ID)
  return request
    .post({
      url: API_URLS.getToken,
      subdomain: "oAuth",
      data,
      successMessage: "ورود با موفقیت انجام شد",
      failMessage: "ورود با شکست مواجه شد",
    })
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
  data.append("id_token", getToken({ useIdToken: true }))

  return request.post({
    url: API_URLS.logout,
    subdomain: "oAuth",
    data,
    successMessage: "خروج با موفقیت انجام شد",
    failMessage: "خروج با موفقیت انجام نشد",
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
