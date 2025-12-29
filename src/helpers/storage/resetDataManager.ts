import authActions from "@/context/auth/authActions"

function configResetData() {
  window.resetData = (props) => {
    const event = new CustomEvent("resetData", { detail: props })
    window.dispatchEvent(event)
  }
}

function resetData({
  isAfterLogin,
  sendLogoutReq,
}: {
  isAfterLogin: boolean
  sendLogoutReq?: boolean
}) {
  if (!window.resetData) {
    configResetData()
  }

  return new Promise<void>((resolve) => {
    if (!isAfterLogin) {
      if (sendLogoutReq) {
        return authActions
          .logout()
          .finally(() => window.resetData?.({ isAfterLogin }))
      } else {
        window.resetData?.({ isAfterLogin })
        resolve()
      }
    } else {
      window.resetData?.({ isAfterLogin })
      resolve()
    }
  })
}

function setResetDataListener({
  callBack,
}: {
  callBack: (props: { detail: { isAfterLogin: boolean } }) => void
}) {
  // @ts-expect-error "shit"
  window.addEventListener("resetData", callBack, { passive: true })
}

const resetDataManager = { resetData, setResetDataListener }

export default resetDataManager
