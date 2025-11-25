"use client"

import { Box, Typography } from "@mui/material"
import type { LandingInfoStatsProps, StatItem } from "./types"
import styles from "./styles/LandingInfoStats.module.scss"

const defaultStats: LandingInfoStatsProps["stats"] = [
  {
    value: "$2.5B+",
    label: "Transactions Secured",
  },
  {
    value: "500K+",
    label: "Happy Users",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
]

export default function LandingInfoStats({
  className,
  stats = defaultStats,
}: LandingInfoStatsProps) {
  const statsToDisplay = (stats ?? defaultStats) as StatItem[]

  return (
    <Box className={`${styles.statsContainer} ${className || ""}`}>
      {statsToDisplay.map((stat, index) => (
        <Box key={`${stat.value}-${index}`} className={styles.statItem}>
          <Typography className={styles.value}>{stat.value}</Typography>
          <Typography className={styles.label}>{stat.label}</Typography>
        </Box>
      ))}
    </Box>
  )
}
