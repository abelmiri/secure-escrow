import { Typography, Box } from "@mui/material"
import type { LandingHeadingProps } from "./types"
import styles from "./styles/LandingHeading.module.scss"

export default function LandingHeading({
  className,
  firstLine = "Secure Transactions",
  secondLine = "You Can Trust",
}: LandingHeadingProps) {
  return (
    <Box className={`${styles.heading} ${className || ""}`}>
      <Typography className={styles.firstLine}>{firstLine}</Typography>
      <Typography className={styles.secondLine}>{secondLine}</Typography>
    </Box>
  )
}
