import React from "react"
import { Box, Typography } from "@mui/material"
import styles from "./styles/AboutUs.module.scss"

export default function AboutUs() {
  return (
    <Box className={styles.container}>
      <Typography variant="h1" className={styles.title}>
        درباره امان یار
      </Typography>

      <Typography variant="body1" className={styles.description}>
        امان یار؛ راهکاری حرفه‌ای و قابل ‌اعتماد برای پرداخت امن در معاملات
      </Typography>
    </Box>
  )
}
