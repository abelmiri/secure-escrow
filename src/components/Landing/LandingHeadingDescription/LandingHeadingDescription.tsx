import { Typography } from "@mui/material"
import styles from "./styles/LandingHeadingDescription.module.scss"

export default function LandingHeadingDescription() {
  return (
    <Typography className={styles.description}>
      با استفاده از امان یار، پرداخت شما تا زمان تحویل کامل کالا یا انجام خدمات
      و تایید نهایی، به طور کامل در امان خواهد بود.
    </Typography>
  )
}
