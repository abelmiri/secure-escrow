"use client"

import { Box, Typography, Button } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import Link from "next/link"
import styles from "./styles/HowItWorks.module.scss"
import AgreementIcon from "@/media/svg/AgreementIcon"
import EscrowWalletIcon from "@/media/svg/EscrowWalletIcon"
import DeliveryIcon from "@/media/svg/DeliveryIcon"
import ReleaseFundsIcon from "@/media/svg/ReleaseFundsIcon"
import { ElementType } from "react"
import { SVGProps } from "react"

interface StepCardProps {
  number: string
  title: string
  description: string
  Icon: ElementType<SVGProps<SVGSVGElement>>
  iconSize: number
}

const steps: StepCardProps[] = [
  {
    number: "۰۱",
    title: "توافق طرفین",
    description: "خریدار و فروشنده بر سر جزئیات و شرایط معامله توافق می‌کنند",
    Icon: AgreementIcon,
    iconSize: 40,
  },
  {
    number: "۰۲",
    title: "پرداخت خریدار",
    description:
      "خریدار مبلغ را پرداخت می‌کند و وجه به صورت امن در حساب امانی نزد بانک نگهداری می‌شود",
    Icon: EscrowWalletIcon,
    iconSize: 40,
  },
  {
    number: "۰۳",
    title: "تحویل کالا یا خدمت",
    description: "کالا یا خدمت از طرف فروشنده به خریدار تحویل  می‌شود",
    Icon: DeliveryIcon,
    iconSize: 40,
  },
  {
    number: "۰۴",
    title: "آزادسازی وجه",
    description:
      "مبلغ نگهداری شده در حساب امانی پس از تایید نهایی خریدار برای فروشنده واریز می‌گردد",
    Icon: ReleaseFundsIcon,
    iconSize: 40,
  },
]

export default function HowItWorks() {
  return (
    <Box className={styles.container}>
      <Typography variant="h2" className={styles.title}>
        نحوه انجام معاملات در امان یار
      </Typography>

      <Typography variant="h6" className={styles.subtitle}>
        فرایندی ساده، امن و شفاف
        <br />
        با اطمینان کامل از شروع تا پایان، هر مرحله از معامله تحت کنترل شماست
      </Typography>

      <Box className={styles.cardsContainer}>
        {steps.map((step) => (
          <Box key={step.number} className={styles.card}>
            <Box className={styles.badge}>{step.number}</Box>

            <Box className={styles.iconContainer}>
              <step.Icon width={step.iconSize} height={step.iconSize} />
            </Box>

            <Typography className={styles.cardTitle}>{step.title}</Typography>

            <Typography className={styles.cardDescription}>
              {step.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Button
        component={Link}
        href="/how-it-works"
        className={styles.learnMoreButton}
        endIcon={<ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />}
      >
        مشاهده جزئیات کامل فرآیند
      </Button>
    </Box>
  )
}
