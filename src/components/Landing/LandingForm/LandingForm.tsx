"use client"

import React, { useState } from "react"
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
} from "@mui/material"
import SmallArrow from "@/media/svg/SmallArrow"
import styles from "./styles/LandingForm.module.scss"

const productTypes = [
  "دامنه‌ها",
  "خدمات قراردادی",
  "تراکنش‌های مرحله‌ای",
  "جواهرات",
  "اشیاء عتیقه",
  "لوازم الکترونیکی",
]

export default function LandingForm() {
  const [role, setRole] = useState("seller")
  const [productType, setProductType] = useState("")
  const [amount, setAmount] = useState("")

  const formatNumber = (value: string): string => {
    // Remove all non-digit characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, "")
    // Split by decimal point
    const parts = cleaned.split(".")
    // Format integer part with commas
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    // Return formatted number
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart
  }

  const parseNumber = (value: string): string => {
    // Remove commas for storage
    return value.replace(/,/g, "")
  }

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const cleaned = parseNumber(e.target.value)
    setAmount(cleaned)
  }

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.row}>
        <FormControl fullWidth className={styles.formControl}>
          <Typography className={styles.label}>نقش شما</Typography>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={styles.select}
            displayEmpty
          >
            <MenuItem value="seller">فروشنده هستم</MenuItem>
            <MenuItem value="buyer">خریدار هستم</MenuItem>
            <MenuItem value="broker">کارگزار هستم</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth className={styles.formControl}>
          <Typography className={styles.label}>نوع محصول</Typography>
          <Select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className={styles.select}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <span className={styles.placeholder}>دامنه، خودرو...</span>
              }
              return selected as string
            }}
          >
            {productTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className={styles.amountSection}>
        <Typography className={styles.label}>مبلغ تراکنش</Typography>
        <TextField
          fullWidth
          value={formatNumber(amount)}
          onChange={handleAmountChange}
          placeholder="0"
          className={styles.amountInput}
          InputProps={{
            endAdornment: (
              <span style={{ marginLeft: 8, color: "#9ca3af" }}>تومان</span>
            ),
          }}
        />
        <Typography className={styles.amountHint}>
          مبلغ تراکنش را به تومان وارد کنید
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        className={styles.submitButton}
        endIcon={<SmallArrow strokeColor="#fff" className={styles.arrowIcon} />}
      >
        همین الان شروع کنید
      </Button>

      <Typography className={styles.footerText}>
        برای ادامه باید یک حساب کاربری ایجاد کنید
      </Typography>
    </Box>
  )
}
