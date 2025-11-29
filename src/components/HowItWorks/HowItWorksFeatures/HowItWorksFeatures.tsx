import React from "react"
import { Box, Typography } from "@mui/material"
import Shield from "@/media/svg/Shield"
import CircleVerified from "@/media/svg/CircleVerified"
import CircleWatch from "@/media/svg/CircleWatch"
import SpeechBubbleIcon from "@/media/svg/SpeechBubbleIcon"
import styles from "./styles/HowItWorksFeatures.module.scss"

const features = [
  {
    icon: <Shield width={32} height={32} strokeColor="white" />,
    title: "پرداخت امن",
    description:
      "تمام پرداخت‌ها در حساب‌های امانی جداگانه و بیمه‌شده نگهداری می‌شوند.",
  },
  {
    icon: <CircleVerified width={32} height={32} strokeColor="white" />,
    title: "تراکنش‌های تایید شده",
    description: "هر تراکنش برای امنیت بیشتر تایید و نظارت می‌شود.",
  },
  {
    icon: <CircleWatch width={"32"} height={"32"} color="white" />,
    title: "بازرسی منعطف",
    description: "دوره‌های بازرسی سفارشی را متناسب با نیازهای خود تنظیم کنید.",
  },
  {
    icon: <SpeechBubbleIcon width="32" height="32" color="white" />,
    title: "پشتیبانی ۲۴/۷",
    description: "تیم ما در تمام ساعات شبانه‌روز آماده کمک به شماست.",
  },
]

export default function HowItWorksFeatures() {
  return (
    <section className={styles.container}>
      <Typography variant="h2" className={styles.title}>
        چرا فرآیند ما را انتخاب کنید
      </Typography>
      <Typography variant="body1" className={styles.subtitle}>
        طراحی شده با در نظر گرفتن امنیت و راحتی
      </Typography>

      <div className={styles.grid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.iconWrapper}>{feature.icon}</div>
            <Typography className={styles.cardTitle}>
              {feature.title}
            </Typography>
            <Typography className={styles.cardDescription}>
              {feature.description}
            </Typography>
          </div>
        ))}
      </div>
    </section>
  )
}
