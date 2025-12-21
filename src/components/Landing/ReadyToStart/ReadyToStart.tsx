import { Box, Typography, Button } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import styles from "./styles/ReadyToStart.module.scss"

export default function ReadyToStart({ howItWorks }: { howItWorks?: boolean }) {
  const title = howItWorks
    ? "آماده شروع هستید؟"
    : "شروع معامله با امان یار، انتخابی امن برای خرید و فروش"
  const subtitle = howItWorks
    ? "اولین تراکنش امن خود را در دقایقی بسازید"
    : "خرید، فروش و انجام تراکنش‌های مطمئن از خودرو و املاک تا کالاهای لوکس و با ارزش"
  const buttonText = howItWorks ? "شروع یک معامله" : "آغاز معامله"
  const secondaryButtonText = howItWorks ? "تماس با ما" : ""
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

          {secondaryButtonText && (
            <Button className={styles.secondaryButton}>
              {secondaryButtonText}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
