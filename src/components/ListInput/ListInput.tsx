"use client"

import styles from "./style/ListInput.module.scss"

type ListInputProps = {
  title?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  textarea?: boolean
  regex?: RegExp
  valueType?: "string" | "number"
}

export default function ListInput({
  title = "Title",
  placeholder = "Enter text",
  value = "",
  onChange,
  textarea = false,
  regex,
  valueType = "string",
}: ListInputProps) {
  const isInvalid = regex && value !== "" && !regex.test(value)

  const inputClassName = `${styles.input}${
    isInvalid
      ? ` ${styles.inputInvalid}`
      : !value
        ? ` ${styles.placeholder}`
        : ""
  }`

  const textareaClassName = `${styles.textarea}${
    isInvalid
      ? ` ${styles.textareaInvalid}`
      : !value
        ? ` ${styles.placeholder}`
        : ""
  }`

  const handleChange = (val: string) => {
    onChange?.(val)
  }

  return (
    <div className={styles.container}>
      {title && <div className={styles.title}>{title}</div>}
      {textarea ? (
        <textarea
          className={textareaClassName}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : (
        <input
          type={valueType === "number" ? "number" : "text"}
          className={inputClassName}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}
    </div>
  )
}
