import { Typography, Box } from "@mui/material"
import styles from "./styles/LandingHeading.module.scss"

export default function LandingHeading() {
  return (
    <Box className={styles.heading}>
      <Typography className={styles.firstLine}>با امان یار</Typography>
      <Typography className={styles.secondLine}>
        همه خرید و فروش های آنلاین خود را انجام دهید
      </Typography>
    </Box>
  )
}
