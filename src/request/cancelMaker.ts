import type { RefObject } from "react"

function cancelMaker({
  cancelToken,
}: {
  cancelToken?: RefObject<AbortController | null>
}) {
  if (cancelToken && typeof AbortController !== "undefined") {
    const controller = new AbortController()
    cancelToken.current = controller
    return controller.signal
  } else {
    return undefined
  }
}

export default cancelMaker
