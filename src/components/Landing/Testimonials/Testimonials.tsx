import { Box, Typography } from "@mui/material"
import StarFilled from "@/media/svg/StarFilled"
import UserAvatar from "@/media/svg/UserAvatar"
import styles from "./styles/Testimonials.module.scss"

const testimonials = [
  {
    text: "امان یار فرآیند خرید و فروش املاک را برای من بسیار ساده و امن کرد. از ابتدا تا پایان، هم امنیت و هم شفافیت در همه مراحل تضمین شد.",
    name: "کامران سلیمی",
    title: "سرمایه‌گذار املاک",
  },
  {
    text: "من از امان یار برای خرید خودروهای لوکس استفاده کردم. این پلتفرم امنیت و شفافیت بالایی ارائه می‌دهد که باعث شد از معامله کاملاً مطمئن باشم.",
    name: "حسین نیک‌پور",
    title: "خریدار خودرو",
  },
  {
    text: "برای خرید و فروش دامنه‌های باارزش، امان یار بهترین انتخاب است. خدمات حرفه‌ای و تیم پشتیبانی عالی داشتند که باعث شد بدون هیچ نگرانی معامله را انجام دهم",
    name: "آرمان رمضانی",
    title: "صاحب دامنه‌های اینترنتی",
  },
  {
    text: "امان یار به من در فروش کسب‌وکار آنلاین کمک کرد. فرآیند بسیار روان و امن بود و تیم پشتیبانی همیشه آماده کمک بود. کاملاً راضی‌ام.",
    name: "ندا کریمی",
    title: "صاحب کسب‌وکار آنلاین",
  },
  {
    text: "خرید و فروش طلا و جواهرات از طریق امان یار بسیار مطمئن و امن بود. هم خریدار و هم من از انجام معامله با امان یار احساس راحتی و امنیت کردیم.",
    name: "سید مرتضی راد",
    title: "فروشنده طلا و جواهر",
  },
]

export default function Testimonials() {
  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h2" className={styles.title}>
           کاربران ما چه می گویند
        </Typography>
        <Typography className={styles.subtitle}>
          مورد اعتماد هزاران مشتری راضی
        </Typography>
      </Box>

      <Box className={styles.cardsContainer}>
        {testimonials.map((testimonial, index) => (
          <Box key={index} className={styles.card}>
            <Box className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <StarFilled key={i} width={20} height={20} color="var(--color-secondary)" />
              ))}
            </Box>

            <Typography className={styles.reviewText}>
              "{testimonial.text}"
            </Typography>

            <Box className={styles.userInfo}>
              <Box className={styles.avatarContainer}>
                <UserAvatar width={48} height={48} />
              </Box>
              <Box className={styles.userDetails}>
                <Typography className={styles.userName}>
                  {testimonial.name}
                </Typography>
                <Typography className={styles.userTitle}>
                  {testimonial.title}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
