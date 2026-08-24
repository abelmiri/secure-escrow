function headerMaker({ headers }: { headers?: Record<string, string> } = {}) {
  const requestHeaders: Record<string, string> = {
    "Accept-Language": "fa",
  }

  return {
    ...requestHeaders,
    ...(headers ? headers : {}),
  }
}

export default headerMaker
