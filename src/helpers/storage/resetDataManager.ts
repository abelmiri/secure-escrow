import authActions from "@/context/auth/authActions"

function configResetData() {
	window.resetData = props => {
		const event = new CustomEvent("resetData", {detail: props})
		window.dispatchEvent(event)
	}
}

function resetData({isAfterLogin, sendLogoutReq}: {isAfterLogin: boolean; sendLogoutReq?: boolean}) {
	if (!window.resetData) {
		configResetData()
	}

	if (!isAfterLogin) {
		clearTimeout(window.refreshTokenTimer)
	}

	if (!isAfterLogin) {
		if (sendLogoutReq) {
			authActions.logout().finally(() => window.resetData?.({isAfterLogin}))
		} else {
			window.resetData?.({isAfterLogin})
		}
	} else {
		window.resetData?.({isAfterLogin})
		// authEvents.userLogin()
	}
}

function setResetDataListener({callBack}: {callBack: (props: {detail: {isAfterLogin: boolean}}) => void}) {
	// @ts-expect-error "shit"
	window.addEventListener("resetData", callBack, {passive: true})
}

const resetDataManager = {resetData, setResetDataListener}

export default resetDataManager
