function parsePathParams({path, location}: {path: string; location: string}) {
	const tempParams: {[key: string]: string} = {}
	const pathSections = path.match(/\/(:?)((\w|\.|-)+)/g)
	const pathnameSections = location.match(/\/(:?)((\w|%|\.|-)+)/g)
	if (pathSections && pathnameSections) {
		pathSections.forEach((item, index) => {
			if (item && pathnameSections[index]) {
				tempParams[item.replace(/\/(:?)/g, "")] = pathnameSections[index].replace(/\//g, "")
			}
		})
		return tempParams
	} else {
		return tempParams
	}
}

export default parsePathParams
