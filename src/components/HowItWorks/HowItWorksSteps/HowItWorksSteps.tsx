import React from "react"
import { Box, Typography } from "@mui/material"
import CheckedIcon from "@/media/svg/CheckedIcon"
import BuyerSeller from "@/media/svg/BuyerSeller"
import DollarSign from "@/media/svg/DollarSign"
import BoxIcon from "@/media/svg/BoxIcon"
import CircleCheckIcon from "@/media/svg/CircleCheckIcon"
import CreditCardIcon from "@/media/svg/CreditCardIcon"
import styles from "./styles/HowItWorksSteps.module.scss"

const steps = [
  {
    number: 1,
    icon: <BuyerSeller width="24" height="24" strokeColor="#155DFC" />,
    title: "توافق خریدار و فروشنده بر سر شرایط",
    description:
      "هر دو طرف بر سر جزئیات معامله، از جمله قیمت، شرایط ارسال و دوره بازرسی توافق می‌کنند. خریدار یا فروشنده معامله را آغاز می‌کند.",
    checklist: [
      "تعیین شرایط معامله",
      "تعیین دوره بازرسی",
      "توافق بر سر روش ارسال",
      "پذیرش توافق توسط هر دو طرف",
    ],
    imageIcon: <BuyerSeller width="80" height="80" strokeColor="#155DFC" />,
    stepLabel: "مرحله ۱ از ۵",
  },
  {
    number: 2,
    icon: <DollarSign width={24} height={24} strokeColor="#155DFC" />,
    title: "خریدار وجه را واریز می‌کند",
    description:
      "خریدار وجه را به سکیوراسکرو ارسال می‌کند. ما وجوه را تایید کرده و به صورت امن در یک حساب امانی جداگانه نگه می‌داریم.",
    checklist: [
      "پذیرش روش‌های پرداخت متعدد",
      "تایید وجوه در کمتر از ۲۴ ساعت",
      "نگهداری در حساب امانی جداگانه",
      "اطلاع‌رسانی به فروشنده پس از دریافت وجه",
    ],
    imageIcon: <DollarSign width={80} height={80} strokeColor="#155DFC" />,
    stepLabel: "مرحله ۲ از ۵",
  },
  {
    number: 3,
    icon: <BoxIcon width="24" height="24" color="#155DFC" />,
    title: "فروشنده کالا را ارسال می‌کند",
    description:
      "پس از تایید پرداخت، فروشنده مجاز به ارسال کالا می‌شود. اطلاعات پیگیری به تمام طرفین ارائه می‌شود.",
    checklist: [
      "فروشنده کالا را ارسال می‌کند",
      "اشتراک‌گذاری اطلاعات پیگیری",
      "توصیه به بیمه کردن مرسوله",
      "دریافت کالا توسط خریدار",
    ],
    imageIcon: <BoxIcon width="80" height="80" color="#155DFC" />,
    stepLabel: "مرحله ۳ از ۵",
  },
  {
    number: 4,
    icon: <CircleCheckIcon width="24" height="24" color="#155DFC" />,
    title: "خریدار کالا را تایید می‌کند",
    description:
      "خریدار یک دوره بازرسی مشخص برای بررسی کالا دارد. در صورت رضایت، کالا را از طریق پلتفرم ما تایید می‌کند.",
    checklist: [
      "بررسی کالا توسط خریدار",
      "پذیرش یا رد در دوره بازرسی",
      "امکان درخواست مرجوعی",
      "امکان حل اختلاف",
    ],
    imageIcon: <CircleCheckIcon width="80" height="80" color="#155DFC" />,
    stepLabel: "مرحله ۴ از ۵",
  },
  {
    number: 5,
    icon: <CreditCardIcon width="24" height="24" color="#155DFC" />,
    title: "سکیوراسکرو وجه را به فروشنده می‌پردازد",
    description:
      "پس از تایید خریدار، ما وجوه را به فروشنده آزاد می‌کنیم. معامله کامل شده و هر دو طرف محافظت شده‌اند.",
    checklist: [
      "آزادسازی وجوه به فروشنده",
      "پردازش سریع پرداخت",
      "تکمیل تراکنش",
      "محافظت از هر دو طرف",
    ],
    imageIcon: <CreditCardIcon width="80" height="80" color="#155DFC" />,
    stepLabel: "مرحله ۵ از ۵",
  },
]

export default function HowItWorksSteps() {
  return (
    <section className={styles.stepsContainer}>
      {steps.map((step) => (
        <div key={step.number} className={styles.stepCard}>
          <Box className={styles.contentSection}>
            <div className={styles.header}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.iconWrapper}>{step.icon}</div>
            </div>

            <Typography variant="h3" className={styles.title}>
              {step.title}
            </Typography>

            <Typography variant="body1" className={styles.description}>
              {step.description}
            </Typography>

            <div className={styles.list}>
              {step.checklist.map((item, idx) => (
                <div key={idx} className={styles.listItem}>
                  <CheckedIcon color="#00A63E" width="20" height="20" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Box>

          <Box className={styles.imageSection}>
            <div className={styles.imageCard}>
              {step.imageIcon}
              <div className={styles.stepBadge}>{step.stepLabel}</div>
            </div>
          </Box>
        </div>
      ))}
    </section>
  )
}
