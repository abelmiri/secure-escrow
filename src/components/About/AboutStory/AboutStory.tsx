import React from "react"
import { Box, Typography } from "@mui/material"
import Image from "next/image"
import styles from "./styles/AboutStory.module.scss"
import sticks from "@/media/picture/sticks.jpg"

export default function AboutStory() {
  return (
    <section className={styles.container}>
      <Box className={styles.content}>
        <Typography variant="h2" className={styles.title}>
          داستان ما
        </Typography>

        <Typography variant="body1" className={styles.text}>
          امان یار در سال ۲۰۱۰ با یک ماموریت ساده تاسیس شد: امن و مطمئن کردن
          معاملات آنلاین برای همه. آنچه که با یک تیم کوچک از متخصصان امنیت شروع
          شد، اکنون به پیشروترین سرویس اسکرو در جهان تبدیل شده است.
        </Typography>

        <Typography variant="body1" className={styles.text}>
          امروز، ما سالانه از بیش از ۲.۵ میلیارد دلار تراکنش برای بیش از ۵۰۰,۰۰۰
          مشتری در سراسر جهان محافظت می‌کنیم. پلتفرم ما همه چیز از فروش نام
          دامنه تا معاملات املاک و مستغلات را تسهیل کرده است، همواره با همان
          تعهد به امنیت و خدمات مشتریان.
        </Typography>

        <Typography variant="body1" className={styles.text}>
          ما مفتخریم که دارای مجوز و تحت نظارت هستیم و با موسسات مالی و شرکای
          فناوری برای بهبود مستمر خدمات خود همکاری می‌کنیم. تیم متخصصان ما
          اطمینان حاصل می‌کند که هر معامله با دقت و حرفه‌ای‌گری انجام شود.
        </Typography>
      </Box>

      <Box className={styles.imageWrapper}>
        <Image
          src={sticks}
          alt="جلسه تیم امان یار"
          className={styles.image}
          placeholder="blur"
        />
      </Box>
    </section>
  )
}
