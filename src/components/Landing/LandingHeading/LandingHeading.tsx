import { Typography, Box } from "@mui/material"
import styles from "./styles/LandingHeading.module.scss"

export default function LandingHeading() {
  return (
    <Box className={styles.heading}>
      <Typography className={styles.firstLine}>تراکنش‌های امن</Typography>
      <Typography className={styles.secondLine}>
        که می‌توانید به آن اعتماد کنید
      </Typography>
    </Box>
  )
}
