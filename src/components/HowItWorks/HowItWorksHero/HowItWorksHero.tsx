import React from "react"
import { Box, Typography } from "@mui/material"
import styles from "./styles/HowItWorksHero.module.scss"

export default function HowItWorksHero() {
  return (
    <Box className={styles.container}>
      <Typography variant="h1" className={styles.title}>
        مراحل انجام معاملات در امان یار
      </Typography>

      <Typography variant="body1" className={styles.description}>
        فرآیند ساده ۵ مرحله‌ای ما معاملات امن را برای خریداران و فروشندگان تضمین
        می‌کند ، خطر کلاهبرداری را به حداقل می‌رساند و وجه مورد معامله تا زمانی
        که تمام شرایط محقق نشود، در امنیت کامل نگهداری می‌شود.
      </Typography>
    </Box>
  )
}
