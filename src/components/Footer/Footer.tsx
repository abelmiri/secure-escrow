import { Box, Typography, Button } from "@mui/material"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import TelegramIcon from "@mui/icons-material/Telegram"
import Image from "next/image"
import Script from "next/script"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import InstagramIcon from "@mui/icons-material/Instagram"
import Link from "next/link"
import IconSvg from "@/media/svg/IconSvg"
import baleLogo from "@/media/brand/bale-logo.png"
import { COMPANY_ADDRESS, COMPANY_MAP_URL } from "@/constants/companyLocation"
import styles from "./styles/Footer.module.scss"

const enamadTrustSeal =
  "<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=8718686&Code=A2CpjxW10XP774NdHK4KiUIbjH3DNS8g'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=8718686&Code=A2CpjxW10XP774NdHK4KiUIbjH3DNS8g' alt='' style='cursor:pointer' code='A2CpjxW10XP774NdHK4KiUIbjH3DNS8g'></a>"

const associationTrustSeal =
  '<a referrerpolicy="origin" target="_blank" href="https://eanjoman.ir/member/zKXB6POzgnX4RpS9ei5vkqeVm"><img src="https://eanjoman.ir/api/script?code=zKXB6POzgnX4RpS9ei5vkqeVm" alt="انجمن صنفی کارفرمایی فروشگاه های اینترنتی شهر تهران(کسب و کار های اینترنتی)" title="انجمن صنفی کارفرمایی فروشگاه های اینترنتی شهر تهران(کسب و کار های اینترنتی)"></a>'

const irannsrTrustSeal =
  '<a referrerpolicy="origin" target="_blank" href="https://tehran.irannsr.org/fa/trade_unit/3513027/swd_id/104366/%D8%A7%D8%B9%D8%B6%D8%A7%DB%8C-%D8%AD%D9%82%D9%88%D9%82%DB%8C-%D8%AA%D9%88%D8%B3%D8%B9%D9%87-%D8%AA%D8%AC%D8%A7%D8%B1%D8%AA-%D9%87%D9%88%D8%B4%D9%85%D9%86%D8%AF-%D8%A8%D8%A7%D9%86.html"><img src="https://tomanpay.com/wp-content/uploads/2024/11/f0c6526b-c1e8-452f-b733-885f3ee52dca-300x239.png" alt="عضویت در سازمان نظام صنفی رایانه‌ای استان تهران" title="عضویت در سازمان نظام صنفی رایانه‌ای استان تهران"></a>'

const footerLinks = {
  products: [
    "خدمات حساب امانی",
    "دامنه، وب‌سایت و اپلیکیشن",
    "وسایل نقلیه",
    "املاک و مستغلات",
    "کالاهای عمومی",
  ],
  company: [
    { label: "نحوه عملکرد", href: "/how-it-works" },
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
  ],
  support: [
    { label: "سوالات متداول", href: "/faq" },
    { label: "قوانین و مقررات", href: "/terms-and-conditions" },
    { label: "اعتماد و ایمنی", href: "/trust-and-safety" },
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
                <IconSvg className={styles.icon} />
              </Box>
            </Box>

            <Typography className={styles.description}>
              راه حلی مطمئن برای خرید و فروش اینترنتی.
            </Typography>

            <Box className={styles.contactInfo}>
              <Box className={styles.contactItem}>
                <EmailIcon fontSize="small" />
                <Box className={styles.contactValues}>
                  <a
                    href="mailto:info@amanyar.ir"
                    className={styles.contactItemText}
                    dir="ltr"
                  >
                    info@amanyar.ir
                  </a>
                  <a
                    href="mailto:support@amanyar.ir"
                    className={styles.contactItemText}
                    dir="ltr"
                  >
                    support@amanyar.ir
                  </a>
                </Box>
              </Box>
              <Box className={styles.contactItem}>
                <PhoneIcon fontSize="small" />
                <Box className={styles.contactValues}>
                  <a
                    href="tel:+989190071219"
                    className={styles.contactItemText}
                    dir="ltr"
                  >
                    ۰۹۱۹۰۰۷۱۲۱۹
                  </a>
                  <a
                    href="tel:+982191697304"
                    className={styles.contactItemText}
                    dir="ltr"
                  >
                    ۰۲۱۹۱۶۹۷۳۰۴
                  </a>
                </Box>
              </Box>
              <Box className={styles.contactItem}>
                <TelegramIcon fontSize="small" />
                <a
                  href="https://t.me/Amanyar_Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactItemText}
                  dir="ltr"
                >
                  @amanyar_support
                </a>
              </Box>
              <Box className={styles.contactItem}>
                <Image src={baleLogo} alt="" width={20} height={20} />
                <a
                  href="https://ble.ir/amanyarsupport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactItemText}
                  dir="ltr"
                >
                  @amanyarsupport
                </a>
              </Box>
              <Box className={styles.contactItem}>
                <LocationOnIcon fontSize="small" />
                <a
                  href={COMPANY_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactItemText}
                >
                  {COMPANY_ADDRESS}
                </a>
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
              {footerLinks.company.map((link) =>
                link.href ? (
                  <Link key={link.label} href={link.href}>
                    <Typography className={styles.link}>
                      {link.label}
                    </Typography>
                  </Link>
                ) : (
                  <Typography key={link.label} className={styles.link}>
                    {link.label}
                  </Typography>
                ),
              )}
            </Box>
          </Box>

          <Box className={styles.column}>
            <Typography className={styles.columnTitle}>پشتیبانی</Typography>
            <Box className={styles.linkList}>
              {footerLinks.support.map((link) => (
                <Link key={link.label} href={link.href}>
                  <Typography className={styles.link}>{link.label}</Typography>
                </Link>
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

          <Box className={styles.trustSeals}>
            <Box
              id="zibal"
              className={`${styles.trustSeal} ${styles.zibalTrustSeal}`}
              aria-label="پرداخت امن با زیبال"
            >
              <Script
                id="zibal-trust-script"
                src="https://zibal.ir/trust/scripts/zibal-trust-v4.js"
                type="text/javascript"
                strategy="afterInteractive"
              />
            </Box>
            <Box
              className={styles.trustSeal}
              dangerouslySetInnerHTML={{ __html: enamadTrustSeal }}
            />
            <Box
              className={styles.trustSeal}
              dangerouslySetInnerHTML={{ __html: associationTrustSeal }}
            />
            <Box
              className={`${styles.trustSeal} ${styles.irannsrTrustSeal}`}
              dangerouslySetInnerHTML={{ __html: irannsrTrustSeal }}
            />
          </Box>
        </Box>

        <Box className={styles.divider} />

        <Typography className={styles.copyright}>
          © ۱۴۰۴ امان یار. تمامی حقوق محفوظ است.
        </Typography>
      </Box>
    </Box>
  )
}
