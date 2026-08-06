"use client"

import type { ReactNode } from "react"
import useSWR from "swr"
import { Avatar, Box, CircularProgress, Typography, Alert } from "@mui/material"
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined"
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"
import { usePartnerProfile } from "@/hooks/partners/usePartnerProfile"
import styles from "./styles/PartnerProfile.module.scss"

type LocationCollection<T> = {
  provinces?: T[]
  cities?: T[]
}

type LocationItem = {
  id: number | string
  name: string
}

const getInitial = (name?: string) => {
  return Array.from((name ?? "").trim())[0] || "س"
}

const getLocationName = (
  items: LocationItem[] | undefined,
  id: number | string | null | undefined,
) => {
  const item = items?.find((location) => String(location.id) === String(id))
  return item?.name ?? (id ? String(id) : "ثبت نشده")
}

const formatValue = (value?: string | number | null) => {
  return value === null || value === undefined || value === ""
    ? "ثبت نشده"
    : String(value)
}

export default function PartnerProfile({ brokerId }: { brokerId: string }) {
  const { partnerProfile, isLoading, error } = usePartnerProfile(brokerId)
  const { data: provincesData } = useSWR<LocationCollection<LocationItem>>(
    API_URLS.province,
    (url: string) => request.get({ url, dontToast: true }),
  )
  const { data: citiesData } = useSWR<LocationCollection<LocationItem>>(
    partnerProfile?.province
      ? API_URLS.city({ id: Number(partnerProfile.province) })
      : null,
    (url: string) => request.get({ url, dontToast: true }),
  )

  const provinces = provincesData?.provinces ?? []
  const cities = citiesData?.cities ?? []
  const provinceName = getLocationName(provinces, partnerProfile?.province)
  const cityName = getLocationName(cities, partnerProfile?.city)
  const members = partnerProfile?.members ?? []
  const statusItems = [
    {
      title: "قرارداد همکاری منعقد شده است.",
      description: partnerProfile?.is_active
        ? "قرارداد شما تنظیم شده و توسط طرفین امضا شده است"
        : "قرارداد همکاری هنوز فعال نشده است",
      isApproved: !!partnerProfile?.is_active,
    },
    {
      title: "اطلاعات شرکت کامل و مورد تایید است.",
      description: partnerProfile?.is_profile_complete
        ? "اطلاعات شرکت به درستی ثبت شده"
        : "تکمیل یا اصلاح اطلاعات شرکت لازم است",
      isApproved: !!partnerProfile?.is_profile_complete,
    },
    {
      title: "اسناد همکاری و اطلاعاتی شرکت برای امان‌یار ارسال شده است.",
      description: partnerProfile?.are_documents_sent
        ? "اسناد ثبتی شرکت و اساس‌نامه در اختیار امان‌یار قرار گرفته است"
        : "اسناد همکاری هنوز کامل ارسال نشده است",
      isApproved: !!partnerProfile?.are_documents_sent,
    },
    {
      title: "اجازه معامله به عنوان کارگزار امن معاملات به شما داده شده است.",
      description: partnerProfile?.is_allowed_as_broker
        ? "شما مجاز به انجام معاملات کارگزاری هستید"
        : "مجوز لازم را ندارید و امکان معاملات از سمت رگولاتوری به شما داده نشده است",
      isApproved: !!partnerProfile?.is_allowed_as_broker,
    },
  ]

  const renderField = ({
    label,
    value,
    icon,
    fullWidth = false,
    ltr = false,
  }: {
    label: string
    value?: string | number | null
    icon?: ReactNode
    fullWidth?: boolean
    ltr?: boolean
  }) => (
    <Box className={`${styles.field} ${fullWidth ? styles.fullWidth : ""}`}>
      <Typography className={styles.fieldLabel}>{label}</Typography>
      <Box className={`${styles.fieldValue} ${ltr ? styles.ltrValue : ""}`}>
        {icon && <Box className={styles.fieldIcon}>{icon}</Box>}
        <Typography className={styles.fieldText}>
          {formatValue(value)}
        </Typography>
      </Box>
    </Box>
  )

  if (isLoading) {
    return (
      <Box className={styles.loading}>
        <CircularProgress size={40} sx={{ color: "var(--color-secondary)" }} />
      </Box>
    )
  }

  if (error || !partnerProfile) {
    return (
      <Box className={styles.page}>
        <Box className={styles.container}>
          <Alert severity="error" className={styles.alert}>
            دریافت اطلاعات پروفایل کارگزاری با خطا مواجه شد.
          </Alert>
        </Box>
      </Box>
    )
  }

  return (
    <main className={styles.page}>
      <Box className={styles.container}>
        <Box className={styles.header}>
          <Typography component="h1" className={styles.title}>
            تنظیمات حساب کاربری
          </Typography>
          <Typography className={styles.subtitle}>
            حساب و تنظیمات خود را مشاهده کنید
          </Typography>
        </Box>

        <Box className={styles.card}>
          <Box className={styles.sectionHeader}>
            <Typography className={styles.sectionTitle}>
              اطلاعات شرکت
            </Typography>
            <Typography className={styles.sectionSubtitle}>
              درصورتی که در اطلاعات، تناقض یا اشتباهی وجود دارد، لطفا آن را از
              طریق پشتیبان خود اطلاع‌رسانی فرمایید.
            </Typography>
          </Box>

          <Box className={styles.identityRow}>
            <Avatar
              className={styles.companyAvatar}
              src={partnerProfile.image || undefined}
            >
              {getInitial(partnerProfile.name)}
            </Avatar>
            <Box>
              <Typography className={styles.companyName}>
                {partnerProfile.name}
              </Typography>
              <Typography className={styles.companyMeta}>
                {partnerProfile.registered_name}
              </Typography>
            </Box>
          </Box>

          <Box className={styles.divider} />

          <Box className={styles.grid}>
            {renderField({
              label: "نام تجاری کسب و کار",
              value: partnerProfile.name,
              icon: <BusinessOutlinedIcon />,
            })}
            {renderField({
              label: "نام ثبتی شرکت",
              value: partnerProfile.registered_name,
            })}
            {renderField({
              label: "شناسه ملی شرکت",
              value: partnerProfile.id_number,
              ltr: true,
            })}
            {renderField({
              label: "شماره ثبت شرکت",
              value: partnerProfile.registration_number,
              ltr: true,
            })}
            {renderField({
              label: "کد اقتصادی شرکت",
              value: partnerProfile.economic_number,
              ltr: true,
            })}
            {renderField({
              label: "شماره تماس شرکت",
              value: partnerProfile.phone_number,
              icon: <PhoneOutlinedIcon />,
              ltr: true,
            })}
            {renderField({
              label: "آدرس ایمیل شرکت",
              value: partnerProfile.email,
              icon: <MailOutlineIcon />,
              ltr: true,
            })}
            {renderField({
              label: "شماره شبا",
              value: partnerProfile.shaba_number,
              icon: <AccountBalanceOutlinedIcon />,
              fullWidth: true,
              ltr: true,
            })}
          </Box>

          <Box className={styles.divider} />

          <Box className={styles.grid}>
            {renderField({ label: "استان", value: provinceName })}
            {renderField({ label: "شهر", value: cityName })}
            {renderField({
              label: "کد پستی",
              value: partnerProfile.postal_code,
              fullWidth: true,
              ltr: true,
            })}
            {renderField({
              label: "آدرس کامل",
              value: partnerProfile.full_address,
              icon: <LocationOnOutlinedIcon />,
              fullWidth: true,
            })}
          </Box>

          {members.length > 0 && (
            <>
              <Box className={styles.divider} />
              <Box className={styles.membersGrid}>
                {members.map((member, index) => {
                  const memberName =
                    `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim()

                  return (
                    <Box key={index} className={styles.memberGroup}>
                      {renderField({
                        label: `نام و نام خانوادگی نماینده ${index + 1}`,
                        value: memberName,
                      })}
                      {renderField({
                        label: `کد ملی نماینده ${index + 1}`,
                        value: member.national_code,
                        ltr: true,
                      })}
                      {renderField({
                        label: `شماره موبایل نماینده ${index + 1}`,
                        value: member.mobile_number,
                        ltr: true,
                      })}
                    </Box>
                  )
                })}
              </Box>
            </>
          )}
        </Box>

        <Box className={styles.card}>
          <Box className={styles.sectionHeader}>
            <Typography className={styles.sectionTitle}>
              وضعیت بررسی انجام معاملات شرکت
            </Typography>
            <Typography className={styles.sectionSubtitle}>
              در صورتی که مجاز به انجام معاملات نیستید، لطفا آن را از طریق
              پشتیبان خود اطلاع‌رسانی فرمایید.
            </Typography>
          </Box>

          <Box className={styles.statusList}>
            {statusItems.map((item) => (
              <Box key={item.title} className={styles.statusItem}>
                <Box className={styles.statusContent}>
                  {item.isApproved ? (
                    <CheckCircleOutlineIcon className={styles.statusSuccess} />
                  ) : (
                    <ErrorOutlineIcon className={styles.statusWarning} />
                  )}
                  <Box>
                    <Typography className={styles.statusTitle}>
                      {item.title}
                    </Typography>
                    <Typography className={styles.statusDescription}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  className={`${styles.statusBadge} ${
                    item.isApproved
                      ? styles.statusApproved
                      : styles.statusRejected
                  }`}
                >
                  {item.isApproved ? "تایید شده" : "رد شده"}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </main>
  )
}
