"use client"

import { Box, Typography, Button } from "@mui/material"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import styles from "./styles/ProfileUserVerification.module.scss"

const CustomCheckIcon = ({
  className,
  sx,
}: {
  className?: string
  sx?: any
}) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      display: "inline-block",
      verticalAlign: "middle",
      flexShrink: 0,
      ...sx,
    }}
  >
    <path
      d="M18.1678 8.33332C18.5484 10.2011 18.2772 12.1428 17.3994 13.8348C16.5216 15.5268 15.0902 16.8667 13.3441 17.6311C11.5979 18.3955 9.64252 18.5381 7.80391 18.0353C5.9653 17.5325 4.35465 16.4145 3.24056 14.8678C2.12646 13.3212 1.57626 11.4394 1.68171 9.53615C1.78717 7.63294 2.54189 5.8234 3.82004 4.4093C5.09818 2.9952 6.82248 2.06202 8.70538 1.76537C10.5883 1.46872 12.516 1.82654 14.167 2.77916"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 9.16659L10 11.6666L18.3333 3.33325"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function ProfileUserVerification() {
  const verifications = [
    {
      title: "تایید ایمیل",
      description: "ایمیل شما تایید شده است",
      status: "verified",
      icon: <CustomCheckIcon className={styles.checkIcon} />,
    },
    {
      title: "تایید موبایل",
      description: "شماره موبایل شما تایید شده است",
      status: "verified",
      icon: <CustomCheckIcon className={styles.checkIcon} />,
    },
    {
      title: "تایید شماره شبا",
      description: "شماره شبا و حساب بانکی شما تایید شده است",
      status: "verified",
      icon: <CustomCheckIcon className={styles.checkIcon} />,
    },
    {
      title: "تایید هویت",
      description: "اسناد را برای تایید هویت خود ارسال کنید",
      status: "pending",
      icon: <ErrorOutlineIcon className={styles.warningIcon} />,
    },
  ]

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography className={styles.title}>
          وضعیت تایید اطلاعات کاربری
        </Typography>
        <Typography className={styles.subtitle}>
          برای انجام معاملات لطفا اطلاعات کاربری خود را تایید کنید
        </Typography>
      </Box>

      <Box className={styles.verificationList}>
        {verifications.map((item, index) => (
          <Box key={index} className={styles.verificationItem}>
            <Box className={styles.itemRight}>
              {item.icon}
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
              {item.status === "verified" ? (
                <Box className={styles.verifiedBadge}>تایید شده</Box>
              ) : (
                <Button variant="outlined" className={styles.startButton}>
                  شروع تایید
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
