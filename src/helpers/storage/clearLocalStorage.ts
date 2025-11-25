function clearLocalStorage({ exceptKeys }: { exceptKeys: Array<string> }) {
  const array: Array<string | null> = []
  exceptKeys.forEach((item) => {
    const value = localStorage.getItem(item)
    array.push(value)
  })
  localStorage.clear()
  array.forEach((item, index) => {
    if (item) localStorage.setItem(exceptKeys[index], item)
  })
}

export default clearLocalStorage
