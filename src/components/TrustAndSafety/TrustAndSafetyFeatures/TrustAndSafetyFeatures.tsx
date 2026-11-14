import React from "react"
import { Box, Typography } from "@mui/material"
import AgreementDocumentIcon from "@/media/svg/AgreementDocumentIcon"
import EscrowWalletIcon from "@/media/svg/EscrowWalletIcon"
import DealControlIcon from "@/media/svg/DealControlIcon"
import IdentityVerificationIcon from "@/media/svg/IdentityVerificationIcon"
import DeliveryIcon from "@/media/svg/DeliveryIcon"
import PhoneIcon from "@/media/svg/PhoneIcon"
import styles from "./styles/TrustAndSafetyFeatures.module.scss"

const features = [
  {
    icon: AgreementDocumentIcon,
    title: "شفافیت شرایط معامله",
    description:
      "شرایط معامله پیش از پرداخت ثبت می‌شود تا خریدار و فروشنده بتوانند جزئیات توافق خود را بررسی کنند.",
  },
  {
    icon: EscrowWalletIcon,
    title: "پرداخت امانی",
    description:
      "وجه معامله بر پایه شرایط توافق‌شده در حساب امانی نگهداری می‌شود و آزادسازی آن به روند معامله وابسته است.",
  },
  {
    icon: DealControlIcon,
    title: "نظارت بر تراکنش‌ها",
    description:
      "وضعیت معامله و مراحل آن در پنل کاربری نمایش داده می‌شود تا طرفین بتوانند روند را پیگیری کنند.",
  },
  {
    icon: IdentityVerificationIcon,
    title: "تایید هویت",
    description:
      "برای انجام معامله، اطلاعات هویتی و پروفایل کاربران در فرایند ثبت‌نام دریافت و بررسی می‌شود.",
  },
  {
    icon: DeliveryIcon,
    title: "پیگیری مراحل",
    description:
      "اطلاعات مربوط به پرداخت، تحویل و تأیید نهایی در مراحل معامله ثبت می‌شود.",
  },
  {
    icon: PhoneIcon,
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
              <feature.icon width={36} height={36} />
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
