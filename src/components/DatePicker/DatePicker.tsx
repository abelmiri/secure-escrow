"use client"

import React, { useMemo } from "react"
import MultiDatePicker from "react-multi-date-picker"
import DateObject from "react-date-object"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import gregorian from "react-date-object/calendars/gregorian"
import gregorian_en from "react-date-object/locales/gregorian_en"
import styles from "./style/DatePicker.module.scss"

interface DatePickerProps {
  title?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: boolean
}

export default function DatePicker({
  title,
  placeholder,
  value,
  onChange,
  required,
  error = false,
}: DatePickerProps) {
  // Convert incoming Gregorian date (YYYY-MM-DD) to Persian for display
  const pickerValue = useMemo(() => {
    if (!value) return undefined
    const [year, month, day] = value.split("-").map(Number)
    if (!year || !month || !day) return undefined

    try {
      const dateObj = new DateObject({
        year,
        month,
        day,
        calendar: gregorian,
      })
      dateObj.convert(persian, persian_fa)
      return dateObj
    } catch {
      return undefined
    }
  }, [value])

  const handleChange = (date: DateObject | null) => {
    if (!date) {
      onChange("")
      return
    }

    try {
      const dateObj = new DateObject(date)
      dateObj.convert(gregorian, gregorian_en)
      const dateStr = dateObj.format("YYYY-MM-DD")
      onChange(dateStr)
    } catch {
      onChange("")
    }
  }

  return (
    <div className={styles.container}>
      {title && (
        <div className={styles.title}>
          {title}
          {required && <span className={styles.required}>*</span>}
        </div>
      )}
      <MultiDatePicker
        zIndex={50}
        value={pickerValue}
        onChange={handleChange}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        inputClass={`${styles.input} ${error ? styles.inputError : ""}`}
        placeholder={placeholder}
        format="YYYY/MM/DD"
        // Ensure the input looks like our other inputs
        containerStyle={{
          width: "100%",
        }}
      />
    </div>
  )
}
