"use client"

import React from "react"
import { Box, Typography, Button } from "@mui/material"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import Link from "next/link"
import styles from "./styles/NotFound.module.scss"

export default function NotFound() {
  return (
    <Box className={styles.container}>
      <Box className={styles.iconWrapper}>
        <ErrorOutlineIcon fontSize="inherit" />
      </Box>
      <Typography variant="h1" className={styles.title}>
        صفحه مورد نظر پیدا نشد
      </Typography>
      <Typography className={styles.description}>
        متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد یا دسترسی به آن محدود شده است. لطفاً به صفحه اصلی بازگردید یا وارد حساب کاربری خود شوید.
      </Typography>
      <Button
        component={Link}
        href="/"
        variant="contained"
        className={styles.button}
      >
        بازگشت به صفحه اصلی
      </Button>
    </Box>
  )
}
