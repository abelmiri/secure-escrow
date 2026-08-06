"use client"

import { useEffect } from "react"
import { Avatar, Box, Typography } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import { useRouter } from "next/navigation"
import useUser from "@/context/auth/hooks/useUser"
import type { RepresentedPartnerType } from "@/context/auth/AuthType"
import { setSelectedRepresentedPartner } from "@/helpers/auth/profileSelection"
import styles from "./styles/ProfileSelection.module.scss"

type ProfileOption =
  | {
      type: "personal"
      id: "personal"
      title: string
      subtitle: string
      image: string | null
    }
  | {
      type: "partner"
      id: string | number
      title: string
      subtitle: string
      partner: RepresentedPartnerType
    }

const getPartnerInitial = (name: string) => {
  return Array.from(name.trim())[0] || "پ"
}

const getSafeReturnTo = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const returnTo = searchParams.get("returnTo")

  if (
    returnTo &&
    returnTo.startsWith("/") &&
    !returnTo.startsWith("//") &&
    returnTo !== "/profile/select"
  ) {
    return returnTo
  }

  return "/dashboard"
}

export default function ProfileSelection() {
  const router = useRouter()
  const { user } = useUser()
  const partners = user?.represented_partners ?? []
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
  const personalTitle =
    fullName || user?.username || user?.mobile_number || "پروفایل شخصی"

  const profileOptions: ProfileOption[] = [
    {
      type: "personal",
      id: "personal",
      title: personalTitle,
      subtitle: "پروفایل شخصی",
      image: user?.image ?? null,
    },
    ...partners.map((partner) => ({
      type: "partner" as const,
      id: partner.id,
      title: partner.name,
      subtitle: "پروفایل کسب‌وکار",
      partner,
    })),
  ]

  const handleSelect = (option: ProfileOption) => {
    if (option.type === "partner") {
      setSelectedRepresentedPartner({
        type: "partner",
        id: option.id,
        name: option.title,
      })
    } else {
      setSelectedRepresentedPartner({
        type: "personal",
        id: null,
        name: option.title,
      })
    }

    router.replace(getSafeReturnTo())
  }

  useEffect(() => {
    if (user && !partners.length) {
      router.replace("/dashboard")
    }
  }, [partners.length, router, user])

  if (!partners.length) {
    return null
  }

  return (
    <main className={styles.page}>
      <Box className={styles.container}>
        <Box className={styles.header}>
          <Typography component="p" className={styles.eyebrow}>
            انتخاب حساب
          </Typography>
          <Typography component="h1" className={styles.title}>
            با کدام پروفایل ادامه می‌دهید؟
          </Typography>
          <Typography className={styles.subtitle}>
            برای ورود به فضای شخصی یا نمایندگی کسب‌وکار، یکی از پروفایل‌های زیر
            را انتخاب کنید.
          </Typography>
        </Box>

        <Box className={styles.optionsGrid}>
          {profileOptions.map((option) => (
            <button
              type="button"
              key={`${option.type}-${option.id}`}
              className={styles.profileCard}
              onClick={() => handleSelect(option)}
            >
              <Box className={styles.avatarFrame}>
                {option.type === "personal" ? (
                  <Avatar
                    className={styles.avatar}
                    src={option.image || undefined}
                  >
                    <PersonOutlineIcon fontSize="inherit" />
                  </Avatar>
                ) : (
                  <Avatar
                    className={`${styles.avatar} ${styles.partnerAvatar}`}
                  >
                    {getPartnerInitial(option.title)}
                  </Avatar>
                )}
              </Box>

              <Box className={styles.cardContent}>
                <Typography component="span" className={styles.optionTitle}>
                  {option.title}
                </Typography>
                <Typography component="span" className={styles.optionSubtitle}>
                  {option.subtitle}
                </Typography>
              </Box>

              <span className={styles.selectButton}>
                ادامه
                {option.type === "partner" ? (
                  <BusinessOutlinedIcon className={styles.buttonIcon} />
                ) : (
                  <ArrowForwardIcon className={styles.buttonIcon} />
                )}
              </span>
            </button>
          ))}
        </Box>
      </Box>
    </main>
  )
}
