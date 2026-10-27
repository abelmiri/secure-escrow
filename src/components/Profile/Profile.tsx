"use client"

import { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import useUser from "@/context/auth/hooks/useUser"
import type { UserType } from "@/context/auth/AuthType"
import PartnerProfile from "@/components/PartnerProfile/PartnerProfile"
import {
  getSelectedRepresentedPartner,
  profileSelectionChangedEvent,
  type SelectedRepresentedPartner,
} from "@/helpers/auth/profileSelection"
import ProfileUserForm from "./ProfileUserForm"
import ProfileUserVerification from "./ProfileUserVerification"
import styles from "./styles/Profile.module.scss"

export type ProfileStep = 1 | 2 | 3

function firstIncompleteStep(user: UserType | null | undefined): ProfileStep {
  if (!user?.national_code_verified) return 1
  if (!user.shaba_number_verified) return 2
  return 3
}

export default function Profile() {
  const { user } = useUser()
  const actorId = String(user?.actor_id ?? "")
  const [stepSelection, setStepSelection] = useState(() => ({
    actorId,
    step: firstIncompleteStep(user),
  }))
  const activeStep =
    stepSelection.actorId === actorId
      ? stepSelection.step
      : firstIncompleteStep(user)
  const setActiveStep = (step: ProfileStep) =>
    setStepSelection({ actorId, step })
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

  const openVerificationStep = (step: 1 | 2) => {
    setActiveStep(step)
    document.getElementById("personal-profile-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

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
        <ProfileUserForm activeStep={activeStep} onStepChange={setActiveStep} />
        <ProfileUserVerification onStartVerification={openVerificationStep} />
      </Box>
    </Box>
  )
}
