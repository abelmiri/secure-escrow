import { Box, Typography, Button } from "@mui/material"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import InstagramIcon from "@mui/icons-material/Instagram"
import IconSvg from "@/media/svg/IconSvg"
import styles from "./styles/Footer.module.scss"

const footerLinks = {
  products: [
    "خدمات امان یار",
    "نام‌های دامنه",
    "وب‌سایت‌ها",
    "وسایل نقلیه",
    "کالاهای عمومی",
    "محاسبه‌گر کارمزد",
  ],
  company: [
    "درباره ما",
    "چگونه کار می‌کند",
    "اعتماد و ایمنی",
    "فرصت‌های شغلی",
    "تماس با ما",
  ],
  support: [
    "مرکز راهنما",
    "سوالات متداول",
    "قوانین و مقررات",
    "حریم خصوصی",
    "قوانین کوکی",
  ],
}

export default function Footer() {
  return (
    <Box component="footer" className={styles.footer}>
      <Box className={styles.container}>
        <Box className={styles.topSection}>
          <Box className={styles.logoSection}>
            <Box className={styles.brand}>
              <Box className={styles.iconContainer}>
                <IconSvg width={32} height={32} className={styles.icon} />
              </Box>
              <Typography className={styles.companyName}>امان یار</Typography>
            </Box>

            <Typography className={styles.description}>
              راه حلی مطمئن برای خرید و فروش اینترنتی.
            </Typography>

            <Box className={styles.contactInfo}>
              <Box className={styles.contactItem}>
                <EmailIcon fontSize="small" />
                <Typography className={styles.contactItemText}>
                  support@secureescrow.com
                </Typography>
              </Box>
              <Box className={styles.contactItem}>
                <PhoneIcon fontSize="small" />
                <Typography className={styles.contactItemText}>
                  09190071219
                </Typography>
              </Box>
              <Box className={styles.contactItem}>
                <LocationOnIcon fontSize="small" />
                <Typography className={styles.contactItemText}>
                  ایران، تهران
                </Typography>
              </Box>
            </Box>

            <Box className={styles.socialLinks}>
              <FacebookIcon className={styles.socialIcon} />
              <TwitterIcon className={styles.socialIcon} />
              <LinkedInIcon className={styles.socialIcon} />
              <InstagramIcon className={styles.socialIcon} />
            </Box>
          </Box>

          <Box className={styles.column}>
            <Typography className={styles.columnTitle}>محصولات</Typography>
            <Box className={styles.linkList}>
              {footerLinks.products.map((link) => (
                <Typography key={link} className={styles.link}>
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box className={styles.column}>
            <Typography className={styles.columnTitle}>شرکت</Typography>
            <Box className={styles.linkList}>
              {footerLinks.company.map((link) => (
                <Typography key={link} className={styles.link}>
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box className={styles.column}>
            <Typography className={styles.columnTitle}>پشتیبانی</Typography>
            <Box className={styles.linkList}>
              {footerLinks.support.map((link) => (
                <Typography key={link} className={styles.link}>
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>

        <Box className={styles.divider} />

        <Box className={styles.bottomSection}>
          <Box className={styles.newsletter}>
            <Typography className={styles.newsletterTitle}>
              به‌روز بمانید
            </Typography>
            <Typography className={styles.newsletterText}>
              برای دریافت آخرین به‌روزرسانی و نکات در خبرنامه ما عضو شوید
            </Typography>
            <Box component="form" className={styles.subscribeForm}>
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className={styles.input}
              />
              <Button className={styles.subscribeButton}>عضویت</Button>
            </Box>
          </Box>
        </Box>

        <Box className={styles.divider} />

        <Typography className={styles.copyright}>
          © ۱۴۰۴ امان یار. تمامی حقوق محفوظ است. سرویس امان یار تحت مجوز رسمی و
          نظارت قانونی فعالیت می‌کند.
        </Typography>
      </Box>
    </Box>
  )
}
