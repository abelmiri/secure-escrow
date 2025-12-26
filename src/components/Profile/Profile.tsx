"use client"

import { Box, Typography } from "@mui/material"
import ProfileUserForm from "./ProfileUserForm"
import ProfileUserVerification from "./ProfileUserVerification"
import styles from "./styles/Profile.module.scss"

export default function Profile() {
  return (
    <Box className={styles.mainWrapper}>
      <Box className={styles.container}>
        <Box className={styles.header}>
          <Typography variant="h1" className={styles.title}>
            تنظیمات حساب کاربری
          </Typography>
          <Typography className={styles.subtitle}>
            حساب و تنظیمات خود را مدیریت کنید
          </Typography>
        </Box>
        <ProfileUserForm />
        <ProfileUserVerification />
      </Box>
    </Box>
  )
}
