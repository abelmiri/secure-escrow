"use client"

import { Box, Typography } from "@mui/material"
import styles from "./styles/LandingInfoStats.module.scss"

interface StatItem {
  value: string
  label: string
}

const defaultStats: StatItem[] = [
  {
    value: "$2.5B+",
    label: "تراکنش‌های امن",
  },
  {
    value: "500K+",
    label: "کاربران راضی",
  },
  {
    value: "4.9/5",
    label: "امتیاز کاربران",
  },
]

export default function LandingInfoStats() {
  return (
    <Box className={styles.statsContainer}>
      {defaultStats.map((stat, index) => (
        <Box key={`${stat.value}-${index}`} className={styles.statItem}>
          <Typography className={styles.value}>{stat.value}</Typography>
          <Typography className={styles.label}>{stat.label}</Typography>
        </Box>
      ))}
    </Box>
  )
}
