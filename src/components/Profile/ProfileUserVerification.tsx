"use client"

import { Box, Typography, Button } from "@mui/material"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import styles from "./styles/ProfileUserVerification.module.scss"
import useUser from "@/context/auth/hooks/useUser"

export default function ProfileUserVerification({
  onStartVerification,
}: {
  onStartVerification: (step: 1 | 2) => void
}) {
  const { user } = useUser()

  const verifications = [
    {
      key: "nationalCode",
      title: "تأیید کد ملی",
      verified: !!user?.national_code_verified,
      actionStep: 1 as const,
      description: user?.national_code_verified
        ? "کد ملی شما تأیید شده است"
        : "کد ملی خود را برای تأیید وارد کنید",
    },
    {
      key: "shaba",
      title: "تأیید شماره شبا",
      verified: !!user?.shaba_number_verified,
      actionStep: 2 as const,
      description: user?.shaba_number_verified
        ? "شماره شبا شما تأیید شده است"
        : "شماره شبای خود را برای تأیید وارد کنید",
    },
    {
      key: "email",
      title: "تأیید ایمیل",
      verified: !!user?.email_verified,
      description: user?.email_verified
        ? "ایمیل شما تأیید شده است"
        : "ایمیل شما هنوز تأیید نشده است",
    },
    {
      key: "identity",
      title: "تأیید هویت",
      verified: !!user?.identity_verified,
      description: user?.identity_verified
        ? "هویت شما تأیید شده است"
        : "هویت شما هنوز تأیید نشده است",
    },
  ]

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography className={styles.title}>
          وضعیت تأیید اطلاعات کاربری
        </Typography>
        <Typography className={styles.subtitle}>
          وضعیت موارد زیر از پروفایل شما دریافت می‌شود
        </Typography>
      </Box>

      <Box className={styles.verificationList}>
        {verifications.map((item) => (
          <Box key={item.key} className={styles.verificationItem}>
            <Box className={styles.itemRight}>
              {item.verified ? (
                <CheckCircleOutlineIcon className={styles.checkIcon} />
              ) : (
                <ErrorOutlineIcon className={styles.warningIcon} />
              )}
              <Box className={styles.itemContent}>
                <Typography className={styles.itemTitle}>
                  {item.title}
                </Typography>
                <Typography className={styles.itemDescription}>
                  {item.description}
                </Typography>
              </Box>
            </Box>
            <Box className={styles.itemLeft}>
              {item.verified ? (
                <Box className={styles.verifiedBadge}>تأیید شده</Box>
              ) : item.actionStep === 1 ||
                (item.actionStep === 2 && user?.national_code_verified) ? (
                <Button
                  variant="outlined"
                  className={styles.startButton}
                  onClick={() => onStartVerification(item.actionStep)}
                >
                  شروع تأیید
                </Button>
              ) : item.actionStep === 2 ? (
                <Typography className={styles.itemDescription}>
                  پس از تأیید کد ملی
                </Typography>
              ) : null}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
