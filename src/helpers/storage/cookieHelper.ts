function setItem(key: string, value: string, expireDay: number = 365) {
    const deleteExpires = "Thu, 01 Jan 1970 00:00:01 GMT"
    const d = new Date()
    d.setTime(d.getTime() + expireDay * 24 * 60 * 60 * 1000)
    const expires = value ? d.toUTCString() : deleteExpires
    document.cookie = `${key}=${value}; SameSite=Lax; Secure; path=/; Priority=High; Expires=${expires};`
}

function removeItem(key: string) {
    setItem(key, "")
}

function getItem(key: string): string {
    return _parseGetCookie({key, source: document.cookie})
}

function _parseGetCookie({key, source = ""}: { key: string; source: string }) {
    const name = `${key}=`
    const ca = source.split(";")
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === " ") {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

const cookieHelper = {setItem, removeItem, getItem}

export default cookieHelper
