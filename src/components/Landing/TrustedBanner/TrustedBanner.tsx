"use client"

import { Box, Typography } from "@mui/material"
import Link from "next/link"
import TrustedBadge from "@/media/svg/TrustedBadge"
import styles from "./styles/TrustedBanner.module.scss"

export default function TrustedBanner() {
  return (
    <Box component={Link} href="/how-it-works" className={styles.trustedBanner}>
      <TrustedBadge width={16} height={16} className={styles.icon} />
      <Typography className={styles.text}>
        راه حلی مطمئن برای خرید و فروش اینترنتی
      </Typography>
    </Box>
  )
}
