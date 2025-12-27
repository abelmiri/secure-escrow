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
    title: "توافق طرفین معامله",
    description:
      "خریدار یا فروشنده معامله را آغاز می‌کنند و پس از توافق بر سر شرایط معامله، طرفین در امان یار ثبت‌نام می‌کنند. سپس قرارداد پایه‌ای شامل شروط معامله تنظیم شده و به تأیید رسمی طرفین قرار داد می رسد ، پس از آن معامله به‌طور رسمی  آغاز خواهد شد.",
    checklist: [
      "توافق بر شرایط معامله و جزئیات آن",
      "تنظیم مدت زمان بازرسی برای بررسی کالا یا خدمات",
      "توافق نهایی بر روش ارسال کالا یا ارائه خدمات",
      "تأیید نهایی توافق از سوی طرفین معامله",
    ],
    imageIcon: <BuyerSeller width="80" height="80" strokeColor="#155DFC" />,
    stepLabel: "مرحله ۱ از ۵",
  },
  {
    number: 2,
    icon: <DollarSign width={24} height={24} strokeColor="#155DFC" />,
    title: "پرداخت وجه از طرف خریدار",
    description:
      "خریدار مبلغ مورد توافق را به حساب امانی نزد بانک عامل واریز می‌کند و پس از آن  وجه در این حساب تا زمانی که صحت معامله  تأیید شود، بر اساس قوانین بانک مرکزی به‌صورت امن بلوکه خواهد شد.",
    checklist: [
      "پذیرش انواع روش‌های پرداخت",
      "تأیید وجوه سریع و امن در کمتر از ۲۴ ساعت توافق نهایی بر روش ارسال کالا یا ارائه خدمات",
      "نگهداری وجه در حساب امانی امن و جداگانه",
      "اطلاع‌رسانی به‌موقع به طرفین معامله",
    ],
    imageIcon: <DollarSign width={80} height={80} strokeColor="#155DFC" />,
    stepLabel: "مرحله ۲ از ۵",
  },
  {
    number: 3,
    icon: <BoxIcon width="24" height="24" color="#155DFC" />,
    title: "ارسال و تحویل کالا یا خدمت از طرف فروشنده",
    description:
      "پس از تایید نهایی پرداخت، فروشنده مجاز به ارسال کالا یا انجام خدمات است. اطلاعات مربوط به فرآیند ارسال و پیگیری به‌طور همزمان به طرفین معامله ارائه می‌شود.",
    checklist: [
      "ارسال کالا توسط فروشنده پس از تایید پرداخت",
      "اشتراک‌گذاری اطلاعات پیگیری و رصد وضعیت ارسال",
      "توصیه به بیمه کردن مرسوله برای امنیت بیشتر",
      "تحویل کالا به خریدار",
    ],
    imageIcon: <BoxIcon width="80" height="80" color="#155DFC" />,
    stepLabel: "مرحله ۳ از ۵",
  },
  {
    number: 4,
    icon: <CircleCheckIcon width="24" height="24" color="#155DFC" />,
    title: "تایید نهایی شروط معامله",
    description:
      "پس از انجام تمامی مراحل پیشین، تایید نهایی شروط معامله پس از بررسی تطابق آن‌ها با شرایط توافق‌شده انجام می‌شود. در این مرحله، اطمینان حاصل می‌شود که تمامی الزامات و توافقات بین خریدار و فروشنده به‌طور کامل رعایت شده است.",
    checklist: [
      "بررسی تطابق کالا یا خدمات با توافقات قرار داد",
      "ارزیابی دقیق شرایط پرداخت شامل مبلغ ، زمانبندی و دیگر شروط",
      "تأیید تکمیل فرآیند تحویل",
      "حل اختلاف در صورت نیاز",
    ],
    imageIcon: <CircleCheckIcon width="80" height="80" color="#155DFC" />,
    stepLabel: "مرحله ۴ از ۵",
  },
  {
    number: 5,
    icon: <CreditCardIcon width="24" height="24" color="#155DFC" />,
    title: "آزادسازی وجه",
    description:
      "پس از تکمیل تمامی مراحل معامله و تأیید نهایی شروط، مبلغ نگهداری شده در حساب امانی با پایان دوره بازرسی به فروشنده آزاد می‌شود. این فرآیند تضمین می‌کند که پرداخت تنها پس از رعایت کامل شرایط توافق‌شده انجام می‌شود.",
    checklist: [
      "تأیید نهایی تطابق کالا یا خدمات",
      "اطمینان از تحویل کامل و بدون مشکل کالا",
      "آزاد سازی وجوه به فروشنده",
      "پردازش سریع و تکمیل تراکنش",
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
                  <CheckedIcon color="#00A63E" width="20" height="20" className={styles.checkedIcon}/>
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
