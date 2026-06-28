import cancelMaker from "@/request/cancelMaker"
import headerMaker from "@/request/headerMaker"
import urlMaker from "@/request/urlMaker"
import type {
  RequestDelType,
  RequestErrorType,
  RequestGetType,
  RequestPatchType,
  RequestPostType,
  RequestUploadAxiosType,
} from "@/request/RequestTypes"
import { toastManager } from "@/lib/toastManager"
import { getErrorMessage, toastConstant } from "@/lib/errorHelpers"
import handleUnauthorized from "@/helpers/auth/handleUnauthorized"
import refreshAccessToken from "@/helpers/auth/refreshAccessToken"

type RequestResult = Awaited<ReturnType<Body["json"]>>

function get(options: RequestGetType): Promise<RequestResult> {
  const {
    url,
    subdomain,
    params,
    cancelToken,
    dontToast,
    successMessage,
    failMessage,
    skipAuthRefresh,
    hasRetriedAfterRefresh,
  } = options
  const reqUrl = urlMaker({ url, params, subdomain })
  return fetch(reqUrl, {
    headers: headerMaker(),
    signal: cancelMaker({ cancelToken }),
  })
    .then((res) => {
      if (res.status === 204) {
        _successHandler({ successMessage, dontToast, method: "GET" })
        return null
      }
      const contentType = res.headers.get("content-type")
      const isJson = !!(
        contentType && contentType.indexOf("application/json") !== -1
      )
      return res[isJson ? "json" : "text"]().then((data) => {
        if (res.ok) {
          _successHandler({ successMessage, dontToast, method: "GET" })
          return data
        } else {
          return _serverErrorHandler({
            status: res.status,
            data,
            callback: () => get({ ...options, hasRetriedAfterRefresh: true }),
            canRefreshToken: !skipAuthRefresh && !hasRetriedAfterRefresh,
          })
        }
      })
    })
    .catch((err) => {
      return _networkErrorHandler({ err, dontToast, failMessage })
    })
}

function post(options: RequestPostType): Promise<RequestResult> {
  const {
    url,
    subdomain,
    data,
    params,
    cancelToken,
    dontToast,
    successMessage,
    failMessage,
    skipAuthRefresh,
    hasRetriedAfterRefresh,
  } = options
  const reqUrl = urlMaker({ url, params, subdomain })
  const isURLSearchParams = data instanceof URLSearchParams
  const isFormData = data instanceof FormData
  return fetch(reqUrl, {
    method: "POST",
    body: isURLSearchParams || isFormData ? data : JSON.stringify(data),
    headers: headerMaker({
      headers: {
        ...(!isFormData && !isURLSearchParams
          ? { "content-type": "application/json" }
          : {}),
      },
    }),
    signal: cancelMaker({ cancelToken }),
  })
    .then((res) => {
      if (res.status === 204) {
        _successHandler({ successMessage, dontToast, method: "POST" })
        return null
      }
      const contentType = res.headers.get("content-type")
      const isJson = !!(
        contentType && contentType.indexOf("application/json") !== -1
      )
      return res[isJson ? "json" : "text"]().then((data) => {
        if (res.ok) {
          _successHandler({ successMessage, dontToast, method: "POST" })
          return data
        } else {
          return _serverErrorHandler({
            data,
            status: res.status,
            callback: () => post({ ...options, hasRetriedAfterRefresh: true }),
            canRefreshToken: !skipAuthRefresh && !hasRetriedAfterRefresh,
          })
        }
      })
    })
    .catch((err) => {
      return _networkErrorHandler({ err, dontToast, failMessage })
    })
}

function patch(options: RequestPatchType): Promise<RequestResult> {
  const {
    url,
    subdomain,
    data,
    params,
    cancelToken,
    dontToast,
    successMessage,
    failMessage,
    skipAuthRefresh,
    hasRetriedAfterRefresh,
  } = options
  const reqUrl = urlMaker({ url, params, subdomain })
  const isURLSearchParams = data instanceof URLSearchParams
  const isFormData = data instanceof FormData
  return fetch(reqUrl, {
    method: "PATCH",
    body: isURLSearchParams || isFormData ? data : JSON.stringify(data),
    headers: headerMaker({
      headers: {
        ...(!isFormData && !isURLSearchParams
          ? { "content-type": "application/json" }
          : {}),
      },
    }),
    signal: cancelMaker({ cancelToken }),
  })
    .then((res) => {
      if (res.status === 204) {
        _successHandler({ successMessage, dontToast, method: "PATCH" })
        return null
      }
      const contentType = res.headers.get("content-type")
      const isJson = !!(
        contentType && contentType.indexOf("application/json") !== -1
      )
      return res[isJson ? "json" : "text"]().then((data) => {
        if (res.ok) {
          _successHandler({ successMessage, dontToast, method: "PATCH" })
          return data
        } else {
          return _serverErrorHandler({
            data,
            status: res.status,
            callback: () => patch({ ...options, hasRetriedAfterRefresh: true }),
            canRefreshToken: !skipAuthRefresh && !hasRetriedAfterRefresh,
          })
        }
      })
    })
    .catch((err) => {
      return _networkErrorHandler({ err, dontToast, failMessage })
    })
}

function del(options: RequestDelType): Promise<RequestResult> {
  const {
    url,
    subdomain,
    params,
    cancelToken,
    dontToast,
    successMessage,
    failMessage,
    skipAuthRefresh,
    hasRetriedAfterRefresh,
  } = options
  const reqUrl = urlMaker({ url, params, subdomain })
  return fetch(reqUrl, {
    method: "DELETE",
    headers: headerMaker(),
    signal: cancelMaker({ cancelToken }),
  })
    .then((res) => {
      if (res.status === 204) {
        _successHandler({ successMessage, dontToast, method: "DELETE" })
        return null
      }
      const contentType = res.headers.get("content-type")
      const isJson = !!(
        contentType && contentType.indexOf("application/json") !== -1
      )
      return res[isJson ? "json" : "text"]().then((data) => {
        if (res.ok) {
          _successHandler({ successMessage, dontToast, method: "DELETE" })
          return data
        } else {
          return _serverErrorHandler({
            data,
            status: res.status,
            callback: () => del({ ...options, hasRetriedAfterRefresh: true }),
            canRefreshToken: !skipAuthRefresh && !hasRetriedAfterRefresh,
          })
        }
      })
    })
    .catch((err) => {
      return _networkErrorHandler({ err, dontToast, failMessage })
    })
}

function upload(options: RequestUploadAxiosType): Promise<RequestResult> {
  const {
    url,
    subdomain,
    data,
    params,
    cancelToken,
    dontToast,
    successMessage,
    failMessage,
    method,
    progress,
    skipAuthRefresh,
    hasRetriedAfterRefresh,
  } = options
  const reqUrl = urlMaker({ url, params, subdomain })
  const isFormData = data instanceof FormData

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method.toUpperCase(), reqUrl)

    const headers = headerMaker() as Record<string, string>
    Object.keys(headers).forEach((key) => {
      // Browser sets content-type for FormData automatically
      if (key.toLowerCase() === "content-type" && isFormData) return
      xhr.setRequestHeader(key, headers[key])
    })

    if (progress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          progress(percentComplete)
        }
      }
    }

    xhr.onload = () => {
      let responseData
      try {
        responseData = JSON.parse(xhr.responseText)
      } catch {
        responseData = xhr.responseText
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        _successHandler({ successMessage, dontToast, method })
        resolve(responseData)
      } else {
        Promise.resolve()
          .then(() =>
            _serverErrorHandler({
              status: xhr.status,
              data: responseData,
              callback: () =>
                upload({ ...options, hasRetriedAfterRefresh: true }),
              canRefreshToken: !skipAuthRefresh && !hasRetriedAfterRefresh,
            }),
          )
          .then(resolve, (err) => {
            try {
              _networkErrorHandler({ err, dontToast, failMessage })
            } catch (handledError) {
              reject(handledError)
            }
          })
      }
    }

    xhr.onerror = () => {
      try {
        _networkErrorHandler({
          err: "NETWORK_ERROR",
          dontToast,
          failMessage,
        })
      } catch (err) {
        reject(err)
      }
    }

    if (cancelToken?.current) {
      cancelToken.current.signal.onabort = () => {
        xhr.abort()
        reject("CANCEL")
      }
    }

    xhr.send(isFormData ? (data as FormData) : JSON.stringify(data))
  })
}

function _successHandler({
  successMessage,
  dontToast,
  method,
}: {
  successMessage?: string
  dontToast?: boolean
  method?: string
}) {
  if (typeof window !== "undefined" && !dontToast) {
    const isMutation =
      method &&
      ["post", "patch", "put", "delete"].includes(method.toLowerCase())
    const message =
      successMessage || (isMutation ? "عملیات با موفقیت انجام شد" : null)

    if (message) {
      toastManager.addToast({
        message,
        type: "SUCCESS",
      })
    }
  }
}

function _serverErrorHandler({
  data,
  status,
  callback,
  canRefreshToken,
}: RequestErrorType) {
  if (status === 401 && canRefreshToken) {
    return refreshAccessToken().then(callback, (refreshError) => {
      handleUnauthorized()
      throw refreshError
    })
  } else if (status === 401 || status === 403) {
    handleUnauthorized()
    throw { status, data }
  } else {
    throw { status, data }
  }
}

function _networkErrorHandler({
  err,
  dontToast,
  failMessage,
}: {
  err: unknown
  dontToast?: boolean
  failMessage?: string
}) {
  const errorObject =
    typeof err === "object" && err !== null
      ? (err as Record<string, unknown>)
      : null
  const errorStatus =
    typeof errorObject?.status === "number" ? errorObject.status : undefined

  if (
    err !== "CANCEL" &&
    errorObject?.code !== "ERR_CANCELED" &&
    !String(err).includes("abort")
  ) {
    if (errorStatus !== 404) {
      console.error(err)
    }

    const isServerErr = errorStatus !== undefined

    if (typeof window !== "undefined" && !dontToast) {
      const message =
        failMessage ||
        (isServerErr
          ? getErrorMessage({ status: errorStatus, data: errorObject?.data })
          : toastConstant.networkError)

      toastManager.addToast({
        message,
        type: "FAIL",
      })
    }
  }
  throw err
}

const request = { get, post, patch, del, upload }

export default request
