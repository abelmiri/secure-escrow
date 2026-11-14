import { Box, Typography } from "@mui/material"
import Image from "next/image"
import BankSecurityIcon from "@/media/svg/BankSecurityIcon"
import AgreementDocumentIcon from "@/media/svg/AgreementDocumentIcon"
import SupportIcon from "@/media/svg/SupportIcon"
import ShieldCheckIcon from "@/media/svg/ShieldCheckIcon"
import CircleTime from "@/media/svg/CircleTime"
import LowFeesIcon from "@/media/svg/LowFeesIcon"
import styles from "./styles/WhyChooseUs.module.scss"
import laptopImg from "@/media/picture/laptop.png"

const features = [
  {
    title: "امنیت بانکی",
    description: "رمزنگاری پیشرفته از دارایی‌های شما محافظت می‌کند",
    Icon: BankSecurityIcon,
  },
  {
    title: "توافق شفاف",
    description: "شرایط معامله پیش از پرداخت ثبت می‌شود",
    Icon: AgreementDocumentIcon,
  },
  {
    title: "پشتیبانی ۲۴/۷",
    description: "تیم پشتیبانی ما همیشه آماده پاسخگویی است",
    Icon: SupportIcon,
  },
]

const bottomCards = [
  {
    title: "تراکنش‌های تایید شده",
    description: "هر تراکنش برای جلوگیری از کلاهبرداری نظارت می‌شود",
    Icon: ShieldCheckIcon,
    iconSize: 40,
    gradient: "linear-gradient(135deg, #00C950 0%, #009966 100%)",
  },
  {
    title: "قیمت‌گذاری شفاف",
    description: "هزینه‌های شفاف بدون هزینه پنهان",
    Icon: LowFeesIcon,
    iconSize: 40,
    gradient: "linear-gradient(135deg, #AD46FF 0%, #9810FA 100%)",
  },
  {
    title: "پردازش سریع",
    description: "تایید و آزادسازی سریع وجه",
    Icon: CircleTime,
    iconSize: 32,
    gradient: "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
  },
]

export default function WhyChooseUs() {
  return (
    <Box className={styles.container}>
      <Box className={styles.contentWrapper}>
        <Box className={styles.leftSection}>
          <Typography variant="h2" className={styles.title}>
            چرا امان یار انتخابی امن، سریع و شفاف برای شماست؟
          </Typography>

          <Typography className={styles.description}>
            یکی از امن ترین و قابل اعتماد ترین روش های خرید در جهان، پرداخت
            امانی و اسکرو می‌باشد که مورد اعتماد هزاران فرد و کسب و کار در سراسر
            جهان است و امان‌یار این سرویس را در ایران ارائه می‌دهد.
          </Typography>

          <Box className={styles.featuresList}>
            {features.map((feature, index) => (
              <Box key={index} className={styles.featureItem}>
                <Box className={styles.iconWrapper}>
                  <feature.Icon width={32} height={32} />
                </Box>
                <Box className={styles.featureContent}>
                  <Typography variant="h6" className={styles.featureTitle}>
                    {feature.title}
                  </Typography>
                  <Typography className={styles.featureDescription}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className={styles.rightSection}>
          <Box className={styles.imageContainer}>
            <Image
              src={laptopImg}
              alt="امان یار روی لپتاپ"
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Box>
        </Box>
      </Box>

      <Box className={styles.bottomCardsContainer}>
        {bottomCards.map((card, index) => (
          <Box key={index} className={styles.bottomCard}>
            <Box
              className={styles.cardIconWrapper}
              style={{ background: card.gradient }}
            >
              <card.Icon
                width={card.iconSize}
                height={card.iconSize}
                strokeColor="white"
              />
            </Box>
            <Box className={styles.cardContent}>
              <Typography variant="h6" className={styles.cardTitle}>
                {card.title}
              </Typography>
              <Typography className={styles.cardDescription}>
                {card.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
