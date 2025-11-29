import { Box, Typography, Button } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import styles from "./styles/ReadyToStart.module.scss"

export default function ReadyToStart({ howItWorks }: { howItWorks?: boolean }) {
  const title = howItWorks
    ? "آماده شروع هستید؟"
    : "آماده شروع معامله امن خود هستید؟"
  const subtitle = howItWorks
    ? "اولین تراکنش امن خود را در دقایقی بسازید"
    : "به هزاران خریدار و فروشنده‌ای بپیوندید که برای معاملات با ارزش بالا به سکیوراسکرو اعتماد کرده‌اند"
  const buttonText = howItWorks ? "شروع یک معامله" : "شروع کنید"
  const secondaryButtonText = howItWorks ? "تماس با ما" : "تماس با فروشنده"
  return (
    <Box
      className={`${styles.container} ${howItWorks ? styles.howItWorks : ""}`}
    >
      <Box className={styles.contentWrapper}>
        <Typography variant="h2" className={styles.title}>
          {title}
        </Typography>

        <Typography className={styles.subtitle}>{subtitle}</Typography>

        <Box className={styles.buttonContainer}>
          <Button
            className={`${styles.primaryButton} ${howItWorks ? styles.howItWorks : ""}`}
            endIcon={<ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />}
          >
            {buttonText}
          </Button>

          <Button className={styles.secondaryButton}>
            {secondaryButtonText}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
