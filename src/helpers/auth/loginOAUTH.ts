import SESSION_STORAGE_VALUES from "@/constants/storage/SESSION_STORAGE_VALUES"
import type {SetUserActionType} from "@/context/auth/AuthType"
import authActions from "@/context/auth/authActions"
import getBrowser from "@/helpers/general/getBrowser"
import createQueryString from "@/helpers/query-param/createQueryString"
import parseQueryString from "@/helpers/query-param/parseQueryString"
import getFullUrl from "@/helpers/query-param/getFullUrl"
import type {Dispatch} from "react"
import urlMaker from "@/request/urlMaker"
import API_URLS from "@/constants/urls/API_URLS"

let redirectUrlVar: string = ""
let codeVerifierVar: string = ""

export function getTokenAfterRedirect({code, authDispatch}: { code: string; authDispatch: Dispatch<SetUserActionType> }): Promise<void> {
    return new Promise((resolve, reject) => {
        const redirectUrl = sessionStorage.getItem(SESSION_STORAGE_VALUES.redirectUrl)
        const codeVerifier = sessionStorage.getItem(SESSION_STORAGE_VALUES.codeVerifier)

        const {state} = parseQueryString()
        const {isLoginByTab, ...params} = parseQueryString({query: decodeURIComponent(atob(typeof state === "string" ? state : ""))})

        if (redirectUrl && codeVerifier) {
            authActions
                .verifyOAUTH({data: {code, code_verifier: codeVerifier, redirect_uri: redirectUrl}, authDispatch})
                .then(() => {
                    // removeQueries({params})
                    resolve()
                })
                .catch(() => {
                    // removeQueries({params})
                    reject()
                })
                .finally(() => {
                    sessionStorage.removeItem(SESSION_STORAGE_VALUES.redirectUrl)
                    sessionStorage.removeItem(SESSION_STORAGE_VALUES.codeVerifier)
                })
        }
        else {
            if (isLoginByTab) {
                // removeQueries({params})
                loginOAUTH({redirect: true})
            }
            else {
                resolve()
            }
        }
    })
}

function getTokenAfterTabLogin(props: { data?: { code?: string } }) {
    const {code} = props?.data ?? {}
    if (code) {
        window.removeEventListener("message", getTokenAfterTabLogin)

        if (redirectUrlVar && codeVerifierVar && window.authDispatch) {
            togglePageLoading({isLoading: true})
            authActions
                .verifyOAUTH({data: {code, code_verifier: codeVerifierVar, redirect_uri: redirectUrlVar}, authDispatch: window.authDispatch})
                .catch(() => {
                    togglePageLoading({isLoading: false})
                })
                .finally(() => {
                    codeVerifierVar = ""
                    redirectUrlVar = ""
                })
        }
    }
}

function loginOAUTH(props?: { redirect?: boolean }) {
    const {redirect} = props || {}
    const isLoginByTab = redirect ? null : getBrowser() === "chrome" ? (url: string) => window.open(url, "login-oAuth") : window.open("", "login-oAuth")
    const redirectUrl = window.location.origin + getFullUrl().pathUrl
    const codeVerifier = generateRandomString(64)

    storeCodeVerifierAndRedirectUrl({isLoginByTab: !!isLoginByTab, data: {redirectUrl, codeVerifier}})

    crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier)).then(digest => {
        const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
        const state = btoa(encodeURIComponent(createQueryString({params: {...parseQueryString(), isLoginByTab: isLoginByTab ? "true" : null}})))
        const redirectLocation = urlMaker({url: API_URLS.login({codeChallenge, redirectUrl, state}), subdomain: "oAuth"})
        if (isLoginByTab) {
            if ("location" in isLoginByTab) {
                isLoginByTab.location.href = redirectLocation
            }
            else {
                isLoginByTab(redirectLocation)
            }
            window.removeEventListener("message", getTokenAfterTabLogin)
            window.addEventListener("message", getTokenAfterTabLogin)
        }
        else {
            window.location.replace(redirectLocation)
        }
    })
}

function storeCodeVerifierAndRedirectUrl({isLoginByTab, data: {redirectUrl, codeVerifier}}: { isLoginByTab: boolean; data: { redirectUrl: string; codeVerifier: string; } }) {
    if (isLoginByTab) {
        redirectUrlVar = redirectUrl
        codeVerifierVar = codeVerifier
    }
    else {
        sessionStorage.setItem(SESSION_STORAGE_VALUES.redirectUrl, redirectUrl)
        sessionStorage.setItem(SESSION_STORAGE_VALUES.codeVerifier, codeVerifier)
    }
}

function togglePageLoading({isLoading}: { isLoading: boolean }) {
    window.authDispatch?.({type: "SET_GETTING_USER", payload: {isLoading}})
}

function generateRandomString(length: number) {
    let text = ""
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

// function removeQueries({params}: { params: Record<string, string | Array<string>> }) {
//     router.replaceState({url: getFullUrl().pathUrl + createQueryString({params}), data: "for-history"})
// }

export default loginOAUTH
