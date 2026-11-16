import Image from "next/image"
import Link from "next/link"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined"
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined"
import TelegramIcon from "@mui/icons-material/Telegram"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { COMPANY_ADDRESS, COMPANY_MAP_URL } from "@/constants/companyLocation"
// Bale logo: https://commons.wikimedia.org/wiki/File:Bale_logo.png (CC0)
import baleLogo from "@/media/brand/bale-logo.png"
// Photo: Vlada Karpovich / Pexels, https://www.pexels.com/photo/photo-of-person-holding-mobile-phone-4050451/
import contactWorkspace from "@/media/picture/contact-workspace.jpg"
import NeshanTehranMap from "./NeshanTehranMap"
import styles from "./page.module.scss"

export const metadata = {
  title: "تماس با ما | امان یار",
  description: "راه‌های ارتباط با پشتیبانی امان یار",
}

export default function ContactPage() {
  return (
    <main>
      <section className={styles.hero}>
        <h1>تماس با ما</h1>
        <p>برای پرسش‌ها و پیگیری معاملات، همراه شما هستیم</p>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.sectionIntro}>
          <span className={styles.eyebrow}>راه‌های ارتباطی</span>
          <h2>از هر راهی که راحت‌ترید، با ما در تماس باشید</h2>
          <p>
            برای پرسش درباره خدمات پرداخت امانی یا پیگیری درخواست خود، راه
            ارتباطی مناسب‌تان را انتخاب کنید.
          </p>
        </div>

        <div className={styles.contactContent}>
          <div className={styles.contactPanel}>
            <div className={styles.contactMethod}>
              <div className={styles.methodHeading}>
                <span className={styles.icon} aria-hidden="true">
                  <EmailOutlinedIcon />
                </span>
                <div>
                  <h3>ایمیل</h3>
                  <p>برای پرسش و پیگیری</p>
                </div>
              </div>
              <div className={styles.methodLinks}>
                <a href="mailto:info@amanyar.ir" className={styles.detailLink}>
                  <span dir="ltr">info@amanyar.ir</span>
                  <ArrowBackIcon fontSize="small" aria-hidden="true" />
                </a>
                <a
                  href="mailto:support@amanyar.ir"
                  className={styles.detailLink}
                >
                  <span dir="ltr">support@amanyar.ir</span>
                  <ArrowBackIcon fontSize="small" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className={styles.contactMethod}>
              <div className={styles.methodHeading}>
                <span className={styles.icon} aria-hidden="true">
                  <PhoneOutlinedIcon />
                </span>
                <div>
                  <h3>تماس تلفنی</h3>
                  <p>شماره‌های ارتباط با ما</p>
                </div>
              </div>
              <div className={styles.methodLinks}>
                <a href="tel:+989190071219" className={styles.detailLink}>
                  <span dir="ltr">۰۹۱۹۰۰۷۱۲۱۹</span>
                  <ArrowBackIcon fontSize="small" aria-hidden="true" />
                </a>
                <a href="tel:+982191697304" className={styles.detailLink}>
                  <span dir="ltr">۰۲۱۹۱۶۹۷۳۰۴</span>
                  <ArrowBackIcon fontSize="small" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className={styles.contactMethod}>
              <div className={styles.methodHeading}>
                <div>
                  <h3>پیام‌رسان‌ها</h3>
                  <p>گفت‌وگوی آنلاین با امان یار</p>
                </div>
              </div>
              <div className={styles.messengerLinks}>
                <a
                  href="https://t.me/Amanyar_Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.messengerLink}
                >
                  <span
                    className={`${styles.brandMark} ${styles.telegramMark}`}
                    aria-hidden="true"
                  >
                    <TelegramIcon />
                  </span>
                  <span className={styles.messengerText}>
                    <strong>تلگرام</strong>
                    <small dir="ltr">@amanyar_support</small>
                  </span>
                  <ArrowBackIcon fontSize="small" aria-hidden="true" />
                </a>
                <a
                  href="https://ble.ir/amanyarsupport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.messengerLink}
                >
                  <span
                    className={`${styles.brandMark} ${styles.baleMark}`}
                    aria-hidden="true"
                  >
                    <Image src={baleLogo} alt="" width={26} height={26} />
                  </span>
                  <span className={styles.messengerText}>
                    <strong>بله</strong>
                    <small dir="ltr">@amanyarsupport</small>
                  </span>
                  <ArrowBackIcon fontSize="small" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className={`${styles.contactMethod} ${styles.locationMethod}`}>
              <NeshanTehranMap />
              <div className={styles.methodHeading}>
                <span className={styles.icon} aria-hidden="true">
                  <PlaceOutlinedIcon />
                </span>
                <div>
                  <h3>موقعیت</h3>
                  <p>
                    <a
                      href={COMPANY_MAP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {COMPANY_ADDRESS}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.imageWrapper}>
            <Image
              src={contactWorkspace}
              alt="میز کار با لپ‌تاپ، تلفن همراه و دفتر یادداشت"
              fill
              className={styles.image}
              placeholder="blur"
              sizes="(max-width: 960px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div>
          <h2>پاسخ پرسش خود را سریع‌تر پیدا کنید</h2>
          <p>پاسخ پرسش‌های رایج درباره معاملات و پرداخت‌ها را بخوانید.</p>
        </div>
        <Link href="/faq" className={styles.faqLink}>
          سوالات متداول
          <ArrowBackIcon fontSize="small" aria-hidden="true" />
        </Link>
      </section>
    </main>
  )
}
