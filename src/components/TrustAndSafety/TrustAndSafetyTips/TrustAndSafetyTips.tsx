import React from "react"
import { Box, Typography } from "@mui/material"
import WarningSign from "@/media/svg/WarningSign"
import CheckedIcon from "@/media/svg/CheckedIcon"
import styles from "./styles/TrustAndSafetyTips.module.scss"

const safetyTips = [
  "هرگز پول را خارج از پلتفرم امان یار ارسال نکنید",
  "قبل از ادامه کار، هویت طرف مقابل را تأیید کنید",
  "از معاملاتی که خیلی خوب به نظر می‌رسند محتاط باشید",
  "همیشه برای اقلام فیزیکی از ارسال ردیابی‌شده استفاده کنید",
  "فعالیت مشکوک را فوراً به تیم پشتیبانی ما گزارش دهید",
  "احراز هویت دو مرحله‌ای را در حساب خود فعال کنید",
]

export default function TrustAndSafetyTips() {
  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Box className={styles.iconWrapper}>
          <WarningSign width={64} height={64} strokeColor="#D08700" />
        </Box>
        <Typography variant="h2" className={styles.title}>
          نکات ایمنی
        </Typography>
        <Typography className={styles.subtitle}>
          از خود در برابر کلاهبرداری محافظت کنید
        </Typography>
      </Box>

      <Box className={styles.tipsContainer}>
        {safetyTips.map((tip, index) => (
          <Box key={index} className={styles.tipItem}>
            <Box className={styles.tipIconWrapper}>
              <CheckedIcon width="24" height="24" color="#00A63E" />
            </Box>
            <Typography className={styles.tipText}>{tip}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
