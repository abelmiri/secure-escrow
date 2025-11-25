import getFullUrl from "@/helpers/query-param/getFullUrl"

function parseQueryString({ query }: { query?: string } = {}) {
  const paramsObj: Record<string, string | Array<string>> = {}
  const search = query !== undefined ? query : getFullUrl().searchUrl
  if (search) {
    const params = new URLSearchParams(search)
    for (const p of params) {
      const [key, value] = p
      if (!paramsObj[key]) {
        paramsObj[key] = value
      } else {
        if (Array.isArray(paramsObj[key])) {
          paramsObj[key].push(value)
        } else {
          paramsObj[key] = [paramsObj[key], p[1]]
        }
      }
    }
  }
  return paramsObj
}

export default parseQueryString
