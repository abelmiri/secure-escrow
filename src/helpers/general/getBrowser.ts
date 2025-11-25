const BROWSER_TYPES = {
  chrome: "chrome",
  firefox: "firefox",
  safari: "safari",
  edge: "edge",
  opera: "opera",
  unknown: "unknown",
} as const

function detectBrowserFromUA(ua: string) {
  if (ua.includes("edg")) {
    return BROWSER_TYPES.edge
  } else if (
    (ua.includes("chrome") ||
      ua.includes("crios") ||
      ua.includes("chromium")) &&
    !ua.includes("edge")
  ) {
    return BROWSER_TYPES.chrome
  } else if (
    ua.includes("safari") &&
    !ua.includes("chrome") &&
    !ua.includes("chromium") &&
    !ua.includes("crios")
  ) {
    return BROWSER_TYPES.safari
  } else if (ua.includes("firefox") || ua.includes("fxios")) {
    return BROWSER_TYPES.firefox
  } else if (ua.includes("opr") || ua.includes("opera")) {
    return BROWSER_TYPES.opera
  }

  return BROWSER_TYPES.unknown
}

function getBrowser() {
  const userAgent = window.navigator.userAgent.toLowerCase()
  return detectBrowserFromUA(userAgent)
}

export default getBrowser
