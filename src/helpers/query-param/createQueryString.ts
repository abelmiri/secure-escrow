function createQueryString({params}: {params: Record<string, string | number | null | Array<string>>}) {
	const filteredKeys = Object.entries(params).filter(([_, value]) => (Array.isArray(value) ? value.length : value || value === 0))
	if (filteredKeys.length) {
		return filteredKeys.reduce((sum, [key, value], index) => {
			const separator = index ? "&" : ""
			if (Array.isArray(value)) {
				if (value.length) {
					return `${sum}${separator}${value.map((item, index) => `${index ? "&" : ""}${key}=${item}`).join("")}`
				} else {
					return sum
				}
			} else {
				return `${sum}${separator}${key}=${value}`
			}
		}, "?")
	} else {
		return ""
	}
}

export default createQueryString
