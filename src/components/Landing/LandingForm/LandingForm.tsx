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
import { useRouter } from "next/navigation"
import useUser from "@/context/auth/hooks/useUser"
import loginOAUTH from "@/helpers/auth/loginOAUTH"
import SmallArrow from "@/media/svg/SmallArrow"
import { useCategories } from "@/hooks/deals/useCategories"
import {
  buildTransactionCreateUrl,
  createPrefillFromLandingForm,
  saveTransactionPrefill,
  type LandingRole,
} from "@/lib/transactionPrefill"
import styles from "./styles/LandingForm.module.scss"

export default function LandingForm() {
  const router = useRouter()
  const { isLoggedIn } = useUser()
  const { categories, isLoading: isCategoriesLoading } = useCategories()
  const [role, setRole] = useState<LandingRole>("seller")
  const [categoryId, setCategoryId] = useState("")
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

  const handleSubmit = (): void => {
    const prefill = createPrefillFromLandingForm({ role, categoryId, amount })
    saveTransactionPrefill(prefill)
    const destination = buildTransactionCreateUrl(prefill)

    if (isLoggedIn) {
      router.push(destination)
      return
    }

    loginOAUTH({ redirect: true, returnTo: destination })
  }

  const handleProfile = (): void => {
    if (isLoggedIn) {
      router.push("/profile")
      return
    }

    loginOAUTH({ redirect: true, returnTo: "/profile" })
  }

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.row}>
        <FormControl fullWidth className={styles.formControl}>
          <Typography className={styles.label}>نقش شما</Typography>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as LandingRole)}
            className={styles.select}
            displayEmpty
          >
            <MenuItem value="seller">فروشنده هستم</MenuItem>
            <MenuItem value="buyer">خریدار هستم</MenuItem>
            <MenuItem value="broker">کارگزار هستم</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth className={styles.formControl}>
          <Typography className={styles.label}>دسته‌بندی معامله</Typography>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={styles.select}
            displayEmpty
            disabled={isCategoriesLoading}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <span className={styles.placeholder}>
                    {isCategoriesLoading
                      ? "در حال بارگذاری..."
                      : "یک دسته‌بندی انتخاب کنید"}
                  </span>
                )
              }
              const category = categories.find(
                (item) => item.id.toString() === selected,
              )
              return category?.name ?? (selected as string)
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id.toString()}>
                {category.name}
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
        onClick={handleSubmit}
      >
        همین الان شروع کنید
      </Button>

      <Typography
        component="button"
        type="button"
        onClick={handleProfile}
        className={styles.footerText}
      >
        برای ادامه باید یک حساب کاربری ایجاد کنید
      </Typography>
    </Box>
  )
}
