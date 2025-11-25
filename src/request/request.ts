import cancelMaker from "@/request/cancelMaker"
import getToken from "@/request/getToken"
import headerMaker from "@/request/headerMaker"
import urlMaker from "@/request/urlMaker"
import type {RequestDelType, RequestErrorType, RequestGetType, RequestPatchType, RequestPostType} from "@/request/RequestTypes"
import authActions from "@/context/auth/authActions"

function get({url, subdomain, params, cancelToken, dontToast}: RequestGetType): Promise<any> {
    const reqUrl = urlMaker({url, params, subdomain})
    return fetch(reqUrl, {headers: headerMaker(), signal: cancelMaker({cancelToken})})
        .then(res => {
            const contentType = res.headers.get("content-type")
            const isJson = !!(contentType && contentType.indexOf("application/json") !== -1)
            return res[isJson ? "json" : "text"]().then(data => {
                if (res.ok) {
                    return data
                }
                else {
                    return _serverErrorHandler({status: res.status, data, callback: () => get(arguments[0])})
                }
            })
        })
        .catch(err => {
            return _networkErrorHandler({err, dontToast})
        })
}

function post({url, subdomain, data, params, cancelToken, dontToast}: RequestPostType) {
    const reqUrl = urlMaker({url, params, subdomain})
    const isURLSearchParams = data instanceof URLSearchParams
    const isFormData = data instanceof FormData
    return fetch(reqUrl, {method: "POST", body: isURLSearchParams || isFormData ? data : JSON.stringify(data), headers: headerMaker({headers: {...(!isFormData && !isURLSearchParams ? {"content-type": "application/json"} : {})}}), signal: cancelMaker({cancelToken})})
        .then(res => {
            const contentType = res.headers.get("content-type")
            const isJson = !!(contentType && contentType.indexOf("application/json") !== -1)
            return res[isJson ? "json" : "text"]().then(data => {
                if (res.ok) {
                    return data
                }
                else {
                    return _serverErrorHandler({data, status: res.status, callback: () => post(arguments[0])})
                }
            })
        })
        .catch(err => {
            return _networkErrorHandler({err, dontToast})
        })
}

function patch({url, subdomain, data, params, cancelToken, dontToast}: RequestPatchType) {
    const reqUrl = urlMaker({url, params, subdomain})
    const isURLSearchParams = data instanceof URLSearchParams
    const isFormData = data instanceof FormData
    return fetch(reqUrl, {method: "PATCH", body: isURLSearchParams || isFormData ? data : JSON.stringify(data), headers: headerMaker({headers: {...(!isFormData && !isURLSearchParams ? {"content-type": "application/json"} : {})}}), signal: cancelMaker({cancelToken})})
        .then(res => {
            const contentType = res.headers.get("content-type")
            const isJson = !!(contentType && contentType.indexOf("application/json") !== -1)
            return res[isJson ? "json" : "text"]().then(data => {
                if (res.ok) {
                    return data
                }
                else {
                    return _serverErrorHandler({data, status: res.status, callback: () => patch(arguments[0])})
                }
            })
        })
        .catch(err => {
            return _networkErrorHandler({err, dontToast})
        })
}

function del({url, subdomain, params, cancelToken, dontToast}: RequestDelType) {
    const reqUrl = urlMaker({url, params, subdomain})
    return fetch(reqUrl, {method: "DELETE", headers: headerMaker(), signal: cancelMaker({cancelToken})})
        .then(res => {
            const contentType = res.headers.get("content-type")
            const isJson = !!(contentType && contentType.indexOf("application/json") !== -1)
            return res[isJson ? "json" : "text"]().then(data => {
                if (res.ok) {
                    return data
                }
                else {
                    return _serverErrorHandler({data, status: res.status, callback: () => del(arguments[0])})
                }
            })
        })
        .catch(err => {
            return _networkErrorHandler({err, dontToast})
        })
}

function _serverErrorHandler({data, status, callback}: RequestErrorType) {
    const refresh_token = getToken({useRefreshToken: true})
    if (status === 401 && "code" in data && data.code === "token_not_valid" && refresh_token) {
        return authActions.refreshToken().then(callback)
    }
    else {
        throw {status, data}
    }
}

function _networkErrorHandler({err, dontToast}: { err: any; dontToast?: boolean }) {
    if (err !== "CANCEL" && err?.code !== "ERR_CANCELED" && !err?.toString()?.includes?.("abort")) {
        if (err?.status !== 404) {
            console.error(err)
        }

        const isServerErr = typeof err === "object" && "status" in err

        if (isServerErr) {
            if (typeof window !== "undefined" && !dontToast) {
                // toastManager.addToast({message: getErrorMessage({status: err?.status, data: err?.data}), type: "FAIL"})
            }
        }
        else {
            if (typeof window !== "undefined" && !dontToast) {
                // const toastConstant = getToastConstant()
                // toastManager.addToast({message: toastConstant.networkError, type: "FAIL"})
            }
        }
    }
    throw err
}

const request = {get, post, patch, del}

export default request
