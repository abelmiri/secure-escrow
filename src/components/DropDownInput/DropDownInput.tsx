import { useState, useMemo, useEffect, useRef } from "react"
import ArrowDown from "@/media/svg/ArrowDown"
import styles from "./styles/DropDownInput.module.scss"

type DropdownOption = {
  label: string
  slug: string
}

type DropdownProps = {
  title?: string
  placeholder?: string
  options?: DropdownOption[]
  onChange?: (slug: string) => void
  disabled?: boolean
}

export default function Dropdown({
  title = "Title",
  placeholder = "Select an option",
  options = [],
  onChange,
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<DropdownOption | null>(null)
  const [search, setSearch] = useState("")

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    )
  }, [options, search])

  const handleSelect = (option: DropdownOption) => {
    setSelected(option)
    setOpen(false)
    setSearch("")
    onChange?.(option.slug)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  return (
    <div className={styles.container} ref={dropdownRef}>
      {title && <div className={styles.title}>{title}</div>}

      <div className={`${styles.dropdown} ${disabled ? styles.disabled : ""}`}>
        <button
          type="button"
          className={styles.input}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          disabled={disabled}
        >
          <span className={selected ? styles.value : styles.placeholder}>
            {selected ? selected.label : placeholder}
          </span>
          <ArrowDown
            className={`${styles.icon} ${open ? styles.iconOpen : ""}`}
          />
        </button>

        {open && (
          <div className={styles.menu}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو"
              className={styles.searchInput}
            />

            {filteredOptions.map((option) => (
              <div
                key={option.slug}
                className={styles.option}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className={styles.option}>بدون نتیجه</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
