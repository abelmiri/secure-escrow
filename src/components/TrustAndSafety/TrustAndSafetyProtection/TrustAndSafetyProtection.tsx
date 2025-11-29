import React from "react"
import { Box, Typography } from "@mui/material"
import CircleCheckIcon from "@/media/svg/CircleCheckIcon"
import styles from "./styles/TrustAndSafetyProtection.module.scss"
import CheckedIcon from "@/media/svg/CheckedIcon"

const protections = [
  {
    title: "پردازش پرداخت امن",
    description:
      "تمام پرداخت‌ها از طریق پردازشگرهای پرداخت دارای گواهینامه PCI DSS سطح 1 پردازش می‌شوند. ما هرگز اطلاعات کامل کارت اعتباری شما را ذخیره نمی‌کنیم.",
  },
  {
    title: "پیشگیری از کلاهبرداری",
    description:
      "الگوریتم‌های پیشرفته تشخیص کلاهبرداری تمام تراکنش‌ها را به صورت بلادرنگ نظارت می‌کنند. فعالیت مشکوک باعث بررسی فوری توسط تیم امنیتی ما می‌شود.",
  },
  {
    title: "حل اختلاف",
    description:
      "در صورت بروز اختلاف، تیم میانجیگری آموزش‌دیده ما تمام شواهد را بررسی می‌کند و با هر دو طرف برای دستیابی به یک راه‌حل عادلانه همکاری می‌کند.",
  },
  {
    title: "حریم خصوصی داده‌ها",
    description:
      "ما با GDPR، CCPA و سایر مقررات حریم خصوصی مطابقت داریم. اطلاعات شخصی شما هرگز بدون رضایت شما با اشخاص ثالث به اشتراک گذاشته نمی‌شود.",
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
