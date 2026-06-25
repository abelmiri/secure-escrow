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
  required?: boolean
  error?: boolean
}

export default function Dropdown({
  title = "Title",
  placeholder = "Select an option",
  options = [],
  onChange,
  disabled = false,
  initialSlug,
  required = false,
  error = false,
}: DropdownProps & { initialSlug?: string }) {
  const [open, setOpen] = useState(false)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const activeSlug = initialSlug ?? selectedSlug
  const selected =
    activeSlug !== undefined && activeSlug !== null
      ? (options.find((opt) => opt.slug.toString() === activeSlug.toString()) ??
        null)
      : null

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    )
  }, [options, search])

  const handleSelect = (option: DropdownOption) => {
    setSelectedSlug(option.slug)
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
      {title && (
        <div className={styles.title}>
          {title}
          {required && (
            <span style={{ color: "red", marginRight: "4px" }}>*</span>
          )}
        </div>
      )}

      <div className={`${styles.dropdown} ${disabled ? styles.disabled : ""}`}>
        <button
          type="button"
          className={`${styles.input} ${error ? styles.inputError : ""}`}
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
