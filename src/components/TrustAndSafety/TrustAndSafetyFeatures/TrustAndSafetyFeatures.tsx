import React from "react"
import { Box, Typography } from "@mui/material"
import Shield from "@/media/svg/Shield"
import LockIcon from "@/media/svg/LockIcon"
import EyeIcon from "@/media/svg/EyeIcon"
import CheckedDocumentIcon from "@/media/svg/CheckedDocumentIcon"
import ServerRacksIcon from "@/media/svg/ServerRacksIcon"
import Badge from "@/media/svg/Badge"
import styles from "./styles/TrustAndSafetyFeatures.module.scss"

const features = [
  {
    icon: Shield,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "شفافیت شرایط معامله",
    description:
      "شرایط معامله پیش از پرداخت ثبت می‌شود تا خریدار و فروشنده بتوانند جزئیات توافق خود را بررسی کنند.",
  },
  {
    icon: LockIcon,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "پرداخت امانی",
    description:
      "وجه معامله بر پایه شرایط توافق‌شده در حساب امانی نگهداری می‌شود و آزادسازی آن به روند معامله وابسته است.",
  },
  {
    icon: EyeIcon,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "نظارت بر تراکنش‌ها",
    description:
      "وضعیت معامله و مراحل آن در پنل کاربری نمایش داده می‌شود تا طرفین بتوانند روند را پیگیری کنند.",
  },
  {
    icon: CheckedDocumentIcon,
    iconProps: { width: "28", height: "28", color: "white" },
    title: "تایید هویت",
    description:
      "برای انجام معامله، اطلاعات هویتی و پروفایل کاربران در فرایند ثبت‌نام دریافت و بررسی می‌شود.",
  },
  {
    icon: ServerRacksIcon,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "پیگیری مراحل",
    description:
      "اطلاعات مربوط به پرداخت، تحویل و تأیید نهایی در مراحل معامله ثبت می‌شود.",
  },
  {
    icon: Badge,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "پشتیبانی و راهنما",
    description:
      "برای پرسش درباره روند معامله یا گزارش مشکل، از راه‌های تماس با پشتیبانی استفاده کنید.",
  },
]

export default function TrustAndSafetyFeatures() {
  return (
    <Box className={styles.container}>
      <Box className={styles.grid}>
        {features.map((feature, index) => (
          <Box key={index} className={styles.card}>
            <Box className={styles.iconWrapper}>
              <feature.icon {...feature.iconProps} />
            </Box>
            <Typography className={styles.cardTitle}>
              {feature.title}
            </Typography>
            <Typography className={styles.cardDescription}>
              {feature.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
