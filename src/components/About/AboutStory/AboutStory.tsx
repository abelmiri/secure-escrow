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
          امان یار یک پلتفرم پیشرفته حوزه پرداخت امن است که به‌عنوان واسطه امن
          برای انجام معاملات آنلاین در ایران فعالیت می‌کند. هدف ما فراهم آوردن
          یک محیط امن، شفاف و قابل‌اعتماد برای انجام معاملات است تا خریداران و
          فروشندگان بتوانند با اطمینان کامل بدون نگرانی از کلاهبرداری و مشکلات
          امنیتی، تجارت کنند.
        </Typography>

        <Typography variant="body1" className={styles.text}>
          {" "}
          پلتفرم امان یار با بهره‌گیری از حساب‌های امانی امن و سیستم‌های
          رمزنگاری پیشرفته، به کاربران این اطمینان را می‌دهد که پرداخت‌ها و
          دارایی‌های آن‌ها تا زمان تکمیل تمام شروط توافق‌شده در امنیت کامل باقی
          می‌ماند. با هدف ایجاد شفافیت در تمامی مراحل معامله، این پلتفرم به‌صورت
          حرفه‌ای و با رعایت استانداردهای بین‌المللی راه‌حل مناسب برای انجام
          معاملات با ارزش بالا، مانند خرید و فروش خودرو، املاک، کالاهای
          الکترونیکی و خدمات ویژه است و به طور تخصصی برای اطمینان از حفاظت از
          دارایی‌ها و شفافیت کامل طراحی شده است.
        </Typography>

        <Typography variant="body1" className={styles.text}>
          این پلتفرم در سال ۱۴۰۴ تأسیس شده است و هم‌اکنون ، تیم ما در تلاش است
          تا با توسعه و بهبود مستمر، خدمات خود را گسترش دهد. این پلتفرم با تمرکز
          بر امنیت، شفافیت و تسهیل فرآیندهای تجاری برای کاربران خود در حال توسعه
          است.
        </Typography>

        <Typography variant="body1" className={styles.text}>
          امان یار با بهره‌گیری از فن‌آوری‌های پیشرفته ، به دنبال تبدیل شدن به
          پلتفرم پیشرو در حوزه پرداخت‌های امن آنلاین در ایران و فراتر از آن است.
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
