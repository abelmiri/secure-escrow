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
        ایجاد اعتماد در معاملات آنلاین از سال ۲۰۱۰. ما مورد اعتمادترین سرویس
        اسکرو در جهان هستیم.
      </Typography>
    </Box>
  )
}
