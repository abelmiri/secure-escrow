import React from "react";
import { Box, Typography } from "@mui/material";
import Shield from "@/media/svg/Shield";
import LockIcon from "@/media/svg/LockIcon";
import EyeIcon from "@/media/svg/EyeIcon";
import CheckedDocumentIcon from "@/media/svg/CheckedDocumentIcon";
import ServerRacksIcon from "@/media/svg/ServerRacksIcon";
import Badge from "@/media/svg/Badge";
import styles from "./styles/TrustAndSafetyFeatures.module.scss";

const features = [
  {
    icon: Shield,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "دارای مجوز و تحت نظارت",
    description:
      "ما به عنوان یک سرویس اسکرو کاملاً دارای مجوز هستیم و با تمام مقررات فدرال و ایالتی مطابقت داریم. عملیات ما به طور منظم برای رعایت مقررات مورد بررسی قرار می‌گیرد.",
  },
  {
    icon: LockIcon,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "امنیت در سطح بانکی",
    description:
      "رمزنگاری SSL 256 بیتی از تمام انتقال داده‌ها محافظت می‌کند. وجوه شما در حساب‌های جداگانه و بیمه‌شده FDIC نگهداری می‌شود که از دارایی‌های شرکت جدا هستند.",
  },
  {
    icon: EyeIcon,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "نظارت بر تراکنش‌ها",
    description:
      "هر تراکنش به صورت 24/7 برای فعالیت‌های مشکوک نظارت می‌شود. تیم پیشگیری از کلاهبرداری ما از الگوریتم‌های پیشرفته برای شناسایی و جلوگیری از کلاهبرداری استفاده می‌کند.",
  },
  {
    icon: CheckedDocumentIcon,
    iconProps: { width: "28", height: "28", color: "white" },
    title: "تایید هویت",
    description:
      "ما هویت تمام کاربران را از طریق روش‌های متعدد از جمله ایمیل، تلفن و تایید اسناد برای تراکنش‌های بزرگ تأیید می‌کنیم.",
  },
  {
    icon: ServerRacksIcon,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "زیرساخت امن",
    description:
      "سرورهای ما در مراکز داده امن و دارای گواهینامه SOC 2 با زمان کارکرد 99.9٪ میزبانی می‌شوند. ممیزی‌های امنیتی منظم یکپارچگی سیستم را تضمین می‌کند.",
  },
  {
    icon: Badge,
    iconProps: { width: "28", height: "28", strokeColor: "white" },
    title: "استانداردهای صنعتی",
    description:
      "ما با PCI DSS برای امنیت پرداخت، GDPR برای حریم خصوصی داده‌ها و مقررات AML/KYC برای تراکنش‌های مالی مطابقت داریم.",
  },
];

export default function TrustAndSafetyFeatures() {
  return (
    <Box className={styles.container}>
      <Box className={styles.grid}>
        {features.map((feature, index) => (
          <Box key={index} className={styles.card}>
            <Box className={styles.iconWrapper}>
              <feature.icon {...feature.iconProps} />
            </Box>
            <Typography className={styles.cardTitle}>{feature.title}</Typography>
            <Typography className={styles.cardDescription}>
              {feature.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

