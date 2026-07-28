export function addCommaToNumber(value: number | string) {
  const [integerPart, decimalPart] = String(value).split(".")
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return decimalPart === undefined
    ? formattedInteger
    : `${formattedInteger}.${decimalPart}`
}

function formatShortNumberValue(value: number) {
  return addCommaToNumber(
    value
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1"),
  )
}

export function toShortNumber(inputNumber = 0, noStyle = false) {
  const number = inputNumber < 0 ? Math.abs(inputNumber) : inputNumber
  const absFlag = noStyle ? false : inputNumber < 0

  try {
    if (number >= 1000000 && number < 1000000000) {
      return `${absFlag ? "(-" : ""}${formatShortNumberValue(number / 1000000)} M${absFlag ? ")" : ""}`
    }

    if (number >= 1000000000) {
      return `${absFlag ? "(-" : ""}${formatShortNumberValue(number / 1000000000)} B${absFlag ? ")" : ""}`
    }

    return `${absFlag ? "(-" : ""}${formatShortNumberValue(number)}${absFlag ? ")" : ""}`
  } catch {
    return number
  }
}
