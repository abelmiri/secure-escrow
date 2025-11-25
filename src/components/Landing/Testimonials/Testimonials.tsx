import { Box, Typography } from "@mui/material"
import StarFilled from "@/media/svg/StarFilled"
import UserAvatar from "@/media/svg/UserAvatar"
import styles from "./styles/Testimonials.module.scss"

const testimonials = [
  {
    text: "سکیوراسکرو خرید ۵۰,۰۰۰ دلاری دامنه من را کاملاً بدون استرس کرد. این فرایند از ابتدا تا انتها روان، حرفه‌ای و امن بود.",
    name: "سارا احمدی",
    title: "سرمایه‌گذار دامنه",
  },
  {
    text: "من از سکیوراسکرو برای فروش کسب‌وکار آنلاینم استفاده کردم. تیم پشتیبانی آنها فوق‌العاده بود و شفافیت در طول فرایند به من آرامش کامل داد.",
    name: "محمدرضا حسینی",
    title: "صاحب کسب‌وکار",
  },
  {
    text: "راه‌حلی عالی برای معاملات خودروهای با ارزش بالا. هم خریدار و هم من احساس امنیت کامل داشتیم و فرایند کارآمد و حرفه‌ای بود.",
    name: "لیلا کریمی",
    title: "فروشنده خودرو",
  },
]

export default function Testimonials() {
  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h2" className={styles.title}>
          مشتریان ما چه می‌گویند
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
                <StarFilled key={i} width={20} height={20} color="#9810FA" />
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
