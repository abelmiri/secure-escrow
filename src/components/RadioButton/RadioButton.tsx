type RadioButtonProps = {
  title: string
  checked: boolean
  onChange: () => void
  name?: string
  value?: string
  disabled?: boolean
}

import styles from "./styles/RadioButton.module.scss"

export default function RadioButton({
  title,
  checked,
  onChange,
  name,
  value,
  disabled = false,
}: RadioButtonProps) {
  return (
    <label className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.hiddenInput}
      />
      <span
        className={`${styles.customRadio} ${checked ? styles.customRadioChecked : ""}`}
      >
        {checked && <span className={styles.checkmark}></span>}
      </span>
      <span className={styles.text}>{title}</span>
    </label>
  )
}
