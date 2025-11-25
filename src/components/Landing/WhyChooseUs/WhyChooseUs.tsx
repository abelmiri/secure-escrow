import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Shield from "@/media/svg/Shield";
import LockIcon from "@/media/svg/LockIcon";
import BuyerSeller from "@/media/svg/BuyerSeller";
import CircleVerified from "@/media/svg/CircleVerified";
import CircleTime from "@/media/svg/CircleTime";
import DollarSign from "@/media/svg/DollarSign";
import styles from "./styles/WhyChooseUs.module.scss";
import laptopImg from "@/media/picture/laptop.png";

const features = [
  {
    title: "امنیت بانکی",
    description: "رمزنگاری پیشرفته از دارایی‌های شما محافظت می‌کند",
    Icon: Shield,
  },
  {
    title: "مجوز و نظارت قانونی",
    description: "کاملاً منطبق با مقررات و قوانین مالی",
    Icon: LockIcon,
  },
  {
    title: "پشتیبانی ۲۴/۷",
    description: "تیم پشتیبانی ما همیشه آماده پاسخگویی است",
    Icon: BuyerSeller,
  },
];

const bottomCards = [
  {
    title: "تراکنش‌های تایید شده",
    description: "هر تراکنش برای جلوگیری از کلاهبرداری نظارت می‌شود",
    Icon: CircleVerified,
    gradient: "linear-gradient(135deg, #00C950 0%, #009966 100%)",
  },
  {
    title: "قیمت‌گذاری شفاف",
    description: "هزینه‌های شفاف بدون هزینه پنهان",
    Icon: DollarSign,
    gradient: "linear-gradient(135deg, #AD46FF 0%, #9810FA 100%)",
  },
  {
    title: "پردازش سریع",
    description: "تایید و آزادسازی سریع وجه",
    Icon: CircleTime,
    gradient: "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
  },
];

export default function WhyChooseUs() {
  return (
    <Box className={styles.container}>
      <Box className={styles.contentWrapper}>
        <Box className={styles.leftSection}>
          <Typography variant="h2" className={styles.title}>
            چرا ما را انتخاب کنید
          </Typography>
          
          <Typography className={styles.description}>
            امن‌ترین و قابل اعتمادترین پلتفرم پرداخت امن، مورد اعتماد هزاران کسب‌وکار در سراسر جهان.
          </Typography>

          <Box className={styles.featuresList}>
            {features.map((feature, index) => (
              <Box key={index} className={styles.featureItem}>
                <Box className={styles.iconWrapper}>
                  <feature.Icon 
                    width={32} 
                    height={32} 
                    strokeColor="var(--color-secondary)" 
                  />
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
              alt="Secure Escrow on Laptop"
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
                width={32} 
                height={32} 
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
  );
}
