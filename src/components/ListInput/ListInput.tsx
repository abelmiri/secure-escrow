"use client"

import styles from "./style/ListInput.module.scss"

type ListInputProps = {
  title?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  textarea?: boolean
  regex?: RegExp
  valueType?: "string" | "number" | "integer"
  rejectPersianDigits?: boolean
  required?: boolean
  error?: boolean
}

export default function ListInput({
  title = "Title",
  placeholder = "Enter text",
  value = "",
  onChange,
  textarea = false,
  regex,
  valueType = "string",
  rejectPersianDigits = false,
  required = false,
  error = false,
}: ListInputProps) {
  const isInvalid = regex && value !== "" && !regex.test(value)

  const inputClassName = `${styles.input}${
    isInvalid || error
      ? ` ${styles.inputInvalid}`
      : !value
        ? ` ${styles.placeholder}`
        : ""
  }`

  const textareaClassName = `${styles.textarea}${
    isInvalid || error
      ? ` ${styles.textareaInvalid}`
      : !value
        ? ` ${styles.placeholder}`
        : ""
  }`

  const toEnglishDigits = (str: string) => {
    return str
      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
      .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
  }

  const formatNumber = (val: string) => {
    if (!val) return ""
    const englishDigits = toEnglishDigits(val.toString()).replace(/,/g, "")
    if (isNaN(Number(englishDigits))) return val
    return Number(englishDigits).toLocaleString("en-US")
  }

  const handleChange = (val: string) => {
    const sanitizedValue = rejectPersianDigits ? val.replace(/[۰-۹]/g, "") : val

    if (valueType === "number" || valueType === "integer") {
      const englishDigits = toEnglishDigits(sanitizedValue)
      const rawValue = englishDigits.replace(/,/g, "").replace(/[^0-9]/g, "")
      onChange?.(rawValue)
    } else {
      onChange?.(sanitizedValue)
    }
  }

  const isNumber = valueType === "number" || valueType === "integer"
  const displayValue = isNumber ? formatNumber(value) : value

  return (
    <div className={styles.container}>
      {title && (
        <div className={styles.title}>
          {title}
          {required && (
            <span style={{ color: "red", marginRight: "4px" }}>*</span>
          )}
        </div>
      )}
      {textarea ? (
        <textarea
          className={textareaClassName}
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : (
        <input
          key={isNumber ? "num-input" : "text-input"}
          type="text"
          className={inputClassName}
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          style={
            isNumber
              ? {
                  direction: "ltr",
                  textAlign: "right",
                  unicodeBidi: "plaintext",
                }
              : {}
          }
        />
      )}
    </div>
  )
}
