"use client"

import { Box, Typography } from "@mui/material"
import TrustedBadge from "@/media/svg/TrustedBadge"
import styles from "./styles/TrustedBanner.module.scss"

export default function TrustedBanner() {
  return (
    <Box className={styles.trustedBanner}>
      <TrustedBadge width={16} height={16} className={styles.icon} />
      <Typography className={styles.text}>
        مورد اعتماد بیش از ۵۰۰,۰۰۰ کاربر در سراسر جهان
      </Typography>
    </Box>
  )
}
