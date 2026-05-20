type RadioButtonProps = {
  title: string
  checked: boolean
  onChange: () => void
}

import styles from "./styles/RadioButton.module.scss"

export default function RadioButton({
  title,
  checked,
  onChange,
}: RadioButtonProps) {
  return (
    <label className={styles.container}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
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
