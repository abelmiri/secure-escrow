"use client"

import { Box, Typography, Button } from "@mui/material"
import { useRouter } from "next/navigation"
import useUser from "@/context/auth/hooks/useUser"
import loginOAUTH from "@/helpers/auth/loginOAUTH"
import styles from "./styles/ReadyToStart.module.scss"

export default function ReadyToStart({ howItWorks }: { howItWorks?: boolean }) {
  const router = useRouter()
  const { isLoggedIn } = useUser()
  const title = howItWorks
    ? "آماده شروع هستید؟"
    : "شروع معامله با امان یار، انتخابی امن برای خرید و فروش"
  const subtitle = howItWorks
    ? "اولین تراکنش امن خود را در دقایقی بسازید"
    : "خرید، فروش و انجام تراکنش‌های مطمئن از خودرو و املاک تا کالاهای لوکس و با ارزش"
  const buttonText = howItWorks ? "شروع یک معامله" : "شروع معامله"
  const secondaryButtonText = howItWorks ? "تماس با ما" : ""

  const handleStart = () => {
    if (isLoggedIn) {
      router.push("/contracts/create")
      return
    }

    loginOAUTH({ redirect: true, returnTo: "/contracts/create" })
  }

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
          {howItWorks ? (
            <Button
              className={`${styles.primaryButton} ${styles.howItWorks}`}
              onClick={handleStart}
            >
              {buttonText}
            </Button>
          ) : (
            <Button className={styles.primaryButton} onClick={handleStart}>
              {buttonText}
            </Button>
          )}

          {secondaryButtonText && (
            <Button
              className={styles.secondaryButton}
              onClick={() => router.push("/contact")}
            >
              {secondaryButtonText}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
