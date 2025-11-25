import { Box, Typography, Button } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import styles from "./styles/ReadyToStart.module.scss"

export default function ReadyToStart() {
  return (
    <Box className={styles.container}>
      <Box className={styles.contentWrapper}>
        <Typography variant="h2" className={styles.title}>
          آماده شروع معامله امن خود هستید؟
        </Typography>

        <Typography className={styles.subtitle}>
          به هزاران خریدار و فروشنده‌ای بپیوندید که برای معاملات با ارزش بالا به
          سکیوراسکرو اعتماد کرده‌اند
        </Typography>

        <Box className={styles.buttonContainer}>
          <Button
            className={styles.primaryButton}
            endIcon={<ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />}
          >
            شروع یک معامله
          </Button>

          <Button className={styles.secondaryButton}>تماس با فروش</Button>
        </Box>
      </Box>
    </Box>
  )
}
