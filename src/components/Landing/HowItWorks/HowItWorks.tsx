import { Box, Typography, Button } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import styles from "./styles/HowItWorks.module.scss"
import BuyerSeller from "@/media/svg/BuyerSeller"
import DollarSign from "@/media/svg/DollarSign"
import DeliverCheck from "@/media/svg/DeliverCheck"
import Badge from "@/media/svg/Badge"
import { ElementType } from "react"
import { SVGProps } from "react"

interface StepCardProps {
  number: string
  title: string
  description: string
  Icon: ElementType<SVGProps<SVGSVGElement> & { strokeColor?: string }>
}

const steps: StepCardProps[] = [
  {
    number: "۰۱",
    title: "توافق طرفین",
    description: "خریدار و فروشنده بر سر جزئیات و شرایط معامله توافق می‌کنند",
    Icon: BuyerSeller,
  },
  {
    number: "۰۲",
    title: "پرداخت خریدار",
    description: "مبلغ پرداختی به صورت امن در حساب امانی ما نگهداری می‌شود",
    Icon: DollarSign,
  },
  {
    number: "۰۳",
    title: "تحویل کالا",
    description: "کالا یا خدمات به خریدار تحویل داده می‌شود",
    Icon: DeliverCheck,
  },
  {
    number: "۰۴",
    title: "آزادسازی وجه",
    description: "مبلغ پس از تایید خریدار برای فروشنده آزاد می‌شود",
    Icon: Badge,
  },
]

export default function HowItWorks() {
  return (
    <Box className={styles.container}>
      <Typography variant="h2" className={styles.title}>
        چگونه کار می‌کند
      </Typography>

      <Typography variant="h6" className={styles.subtitle}>
        فرایندی ساده، امن و شفاف
      </Typography>

      <Box className={styles.cardsContainer}>
        {steps.map((step) => (
          <Box key={step.number} className={styles.card}>
            <Box className={styles.badge}>{step.number}</Box>

            <Box className={styles.iconContainer}>
              <step.Icon width={32} height={32} strokeColor="white" />
            </Box>

            <Typography className={styles.cardTitle}>{step.title}</Typography>

            <Typography className={styles.cardDescription}>
              {step.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Button
        className={styles.learnMoreButton}
        endIcon={<ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />}
      >
        بیشتر درباره فرایند ما بدانید
      </Button>
    </Box>
  )
}
