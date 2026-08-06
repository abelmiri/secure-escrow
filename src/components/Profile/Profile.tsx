"use client"

import { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import PartnerProfile from "@/components/PartnerProfile/PartnerProfile"
import {
  getSelectedRepresentedPartner,
  profileSelectionChangedEvent,
  type SelectedRepresentedPartner,
} from "@/helpers/auth/profileSelection"
import ProfileUserForm from "./ProfileUserForm"
import ProfileUserVerification from "./ProfileUserVerification"
import styles from "./styles/Profile.module.scss"

export default function Profile() {
  const [selectedProfile, setSelectedProfile] =
    useState<SelectedRepresentedPartner | null>(() =>
      getSelectedRepresentedPartner(),
    )

  useEffect(() => {
    const handleProfileSelectionChange = () => {
      setSelectedProfile(getSelectedRepresentedPartner())
    }

    window.addEventListener(
      profileSelectionChangedEvent,
      handleProfileSelectionChange,
    )
    window.addEventListener("storage", handleProfileSelectionChange)

    return () => {
      window.removeEventListener(
        profileSelectionChangedEvent,
        handleProfileSelectionChange,
      )
      window.removeEventListener("storage", handleProfileSelectionChange)
    }
  }, [])

  if (selectedProfile?.type === "partner" && selectedProfile.id) {
    return <PartnerProfile brokerId={String(selectedProfile.id)} />
  }

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
