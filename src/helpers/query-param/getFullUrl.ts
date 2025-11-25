function getFullUrl() {
  // TODO
  const pathUrl = typeof window !== "undefined" ? window.location.pathname : ""
  const searchUrl = typeof window !== "undefined" ? window.location.search : ""
  const fullUrl = pathUrl + searchUrl
  const fullUrlWithDomain =
    typeof window !== "undefined" ? window.location.href : ""
  return { pathUrl, searchUrl, fullUrl, fullUrlWithDomain }
}

export default getFullUrl
