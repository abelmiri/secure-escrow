import React from "react"
import { Box, Typography } from "@mui/material"
import styles from "./styles/TrustAndSafetyProtection.module.scss"
import CheckedIcon from "@/media/svg/CheckedIcon"

const protections = [
  {
    title: "پردازش پرداخت امن",
    description:
      "پرداخت را فقط از مسیرهای معرفی‌شده در سامانه انجام دهید و پیش از تأیید، مبلغ و شرایط معامله را بررسی کنید.",
  },
  {
    title: "پیشگیری از کلاهبرداری",
    description:
      "در صورت مشاهده رفتار مشکوک، ادامه معامله را متوقف کنید و موضوع را به پشتیبانی اطلاع دهید.",
  },
  {
    title: "حل اختلاف",
    description:
      "اگر اختلافی پیش آمد، مستندات معامله و مکاتبات مرتبط را نگه دارید و موضوع را از طریق پشتیبانی پیگیری کنید.",
  },
  {
    title: "حریم خصوصی داده‌ها",
    description:
      "اطلاعات حساب خود را فقط در صفحات رسمی امان یار وارد کنید و رمزها یا کدهای یک‌بارمصرف را در اختیار دیگران نگذارید.",
  },
]

export default function TrustAndSafetyProtection() {
  return (
    <Box className={styles.container}>
      <Typography variant="h2" className={styles.title}>
        چگونه از شما محافظت می‌کنیم
      </Typography>

      <Box className={styles.cardsContainer}>
        {protections.map((protection, index) => (
          <Box key={index} className={styles.card}>
            <Box className={styles.iconWrapper}>
              <CheckedIcon color="#00A63E" width="32" height="32" />
            </Box>
            <Box className={styles.content}>
              <Typography className={styles.cardTitle}>
                {protection.title}
              </Typography>
              <Typography className={styles.cardDescription}>
                {protection.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
