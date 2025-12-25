import { Box, Typography, Button } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import GlobeIcon from "@/media/svg/GlobeIcon"
import TrendingUpIcon from "@/media/svg/TrendingUpIcon"
import LightningIcon from "@/media/svg/LightningIcon"
import Shield from "@/media/svg/Shield"
import StarIcon from "@/media/svg/StarIcon"
import BuyerSeller from "@/media/svg/BuyerSeller"
import styles from "./styles/PerfectTransaction.module.scss"

const categories = [
  {
    title: "دامنه، وبسایت، اپلیکیشن و کالاهای الکترونیکی",
    description:
      "خرید و فروش دامنه‌ها، وبسایت‌ها، اپلیکیشن‌ها و کالاهای الکترونیکی با تضمین امنیت",
    Icon: GlobeIcon,
    iconBg: "linear-gradient(135deg, #00B8DB 0%, #155DFC 100%)", // Blue
  },
  {
    title: "وسایل نقلیه (ماشین و خودرو)",
    description: "خرید و فروش وسایل نقله شخصی و تجاری با امنیت کامل",
    Icon: TrendingUpIcon,
    iconBg: "linear-gradient(135deg, #AD46FF 0%, #E60076 100%)", // Pink/Purple
  },
  {
    title: "املاک و مستغلات",
    description: "معاملات املاک و مستغلات، با تضمین حفاظت از دارایی‌ها",
    Icon: Shield,
    iconBg: "linear-gradient(135deg, #FF6900 0%, #E7000B 100%)", // Orange
  },
  {
    title: "کالاهای عمومی در شبکه‌های اجتماعی",
    description:
      "خرید و فروش کالاهای مختلف از طریق شبکه‌های اجتماعی، با اطمینان از حفاظت از معامله",
    Icon: StarIcon,
    iconBg: "linear-gradient(135deg, #F6339A 0%, #EC003F 100%)", // Pink
  },
  {
    title: "طلا، نقره و فلزات گرانبها",
    description:
      "خرید و فروش طلا، نقره و فلزات گرانبها، با امنیت بالا و شفافیت",
    Icon: LightningIcon,
    iconBg: "linear-gradient(135deg, #00C950 0%, #009966 100%)", // Green
  },
  {
    title: "پرداخت‌های امن برای کسب‌وکارها",
    description: "انجام پرداخت‌ها و معاملات کسب‌وکارها، با اطمینان از شفافیت",
    Icon: BuyerSeller,
    iconBg: "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)", // Purple
  },
]

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
              <category.Icon width={24} height={24} strokeColor="white" />
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
        مشاهده تمام دسته‌بندی‌ها
      </Button>
    </Box>
  )
}
