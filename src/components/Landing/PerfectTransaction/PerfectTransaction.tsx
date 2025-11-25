import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GlobeIcon from "@/media/svg/GlobeIcon";
import TrendingUpIcon from "@/media/svg/TrendingUpIcon";
import LightningIcon from "@/media/svg/LightningIcon";
import Shield from "@/media/svg/Shield";
import StarIcon from "@/media/svg/StarIcon";
import BuyerSeller from "@/media/svg/BuyerSeller";
import styles from "./styles/PerfectTransaction.module.scss";

const categories = [
  {
    title: "نام‌های دامنه",
    description: "انتقال امن دامنه‌های ویژه و با ارزش",
    Icon: GlobeIcon,
    iconBg: "linear-gradient(135deg, #00B8DB 0%, #155DFC 100%)", // Blue
  },
  {
    title: "وسایل نقلیه",
    description: "خرید و فروش خودرو، موتورسیکلت و قایق",
    Icon: TrendingUpIcon,
    iconBg: "linear-gradient(135deg, #AD46FF 0%, #E60076 100%)", // Pink/Purple
  },
  {
    title: "وب‌سایت و اپلیکیشن",
    description: "خرید و فروش کامل کسب‌وکارهای دیجیتال",
    Icon: LightningIcon,
    iconBg: "linear-gradient(135deg, #00C950 0%, #009966 100%)", // Green
  },
  {
    title: "املاک و مستغلات",
    description: "معاملات امن ملک و زمین",
    Icon: Shield,
    iconBg: "linear-gradient(135deg, #FF6900 0%, #E7000B 100%)", // Orange
  },
  {
    title: "کالاهای عمومی",
    description: "کالاهای با ارزش، جواهرات و کلکسیونی",
    Icon: StarIcon,
    iconBg: "linear-gradient(135deg, #F6339A 0%, #EC003F 100%)", // Pink
  },
  {
    title: "فروش کسب‌وکار",
    description: "ادغام و خرید شرکت‌ها و کسب‌وکارهای فعال",
    Icon: BuyerSeller,
    iconBg: "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)", // Purple
  },
];

export default function PerfectTransaction() {
  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h2" className={styles.title}>
          مناسب برای هر نوع معامله
        </Typography>
        <Typography className={styles.subtitle}>
          خدمات پرداخت امن (Escrow) برای صنایع مختلف
        </Typography>
      </Box>

      <Box className={styles.gridContainer}>
        {categories.map((category, index) => (
          <Box key={index} className={styles.card}>
            <Box 
              className={styles.iconWrapper}
              style={{ background: category.iconBg }}
            >
              <category.Icon 
                width={24} 
                height={24} 
                strokeColor="white" 
              />
            </Box>
            <Box className={styles.cardContent}>
              <Typography variant="h6" className={styles.cardTitle}>
                {category.title}
              </Typography>
              <Typography className={styles.cardDescription}>
                {category.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Button 
        className={styles.viewAllButton}
        endIcon={<ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />}
      >
        مشاهده همه دسته‌بندی‌ها
      </Button>
    </Box>
  );
}
