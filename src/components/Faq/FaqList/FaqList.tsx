"use client";

import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import ChevronIcon from "@/media/svg/ChevronIcon";
import styles from "./styles/FaqList.module.scss";

type Category = "General" | "Buyers" | "Sellers" | "Payments" | "Security";

const categories: { id: Category; label: string }[] = [
  { id: "General", label: "عمومی" },
  { id: "Buyers", label: "برای خریداران" },
  { id: "Sellers", label: "برای فروشندگان" },
  { id: "Payments", label: "پرداخت‌ها" },
  { id: "Security", label: "امنیت" },
];

const faqs: Record<Category, { question: string; answer: string }[]> = {
  General: [
    {
      question: "اسکرو چیست و چگونه کار می‌کند؟",
      answer:
        "اسکرو یک سرویس مالی است که به عنوان شخص ثالث بی‌طرف در معاملات عمل می‌کند. وجوه خریدار نزد اسکرو نگهداری می‌شود تا زمانی که کالا یا خدمات تحویل داده شده و تایید شود، سپس پول به فروشنده منتقل می‌شود.",
    },
    {
      question: "فرآیند اسکرو چقدر طول می‌کشد؟",
      answer:
        "مدت زمان فرآیند بستگی به توافق طرفین برای بازرسی و تحویل دارد. معمولاً پس از تحویل کالا، خریدار مدت زمان مشخصی (مثلاً ۳ روز) برای تایید فرصت دارد.",
    },
    {
      question: "آیا پول من با اسکرو امن است؟",
      answer:
        "بله، صد در صد. وجوه شما در حساب‌های امانی امن نگهداری می‌شود و تنها زمانی آزاد می‌شود که تمام شرایط توافق شده در معامله رعایت شده باشد.",
    },
    {
      question: "اگر اختلاف پیش بیاید چه اتفاقی می‌افتد؟",
      answer:
        "در صورت بروز اختلاف، وجوه در حساب اسکرو باقی می‌ماند تا زمانی که تیم حل اختلاف ما موضوع را بررسی کرده و بر اساس مستندات طرفین تصمیم‌گیری کند.",
    },
  ],
  Buyers: [
    {
      question: "چگونه می‌توانم سفارش خود را ثبت کنم؟",
      answer: "برای ثبت سفارش کافیست وارد حساب کاربری خود شوید و با انتخاب گزینه معامله جدید، مشخصات کالا و طرف مقابل را وارد کنید.",
    },
    {
      question: "اگر فروشنده کالا را ارسال نکند چه می‌شود؟",
      answer: "در صورتی که فروشنده در مهلت مقرر کالا را ارسال نکند، می‌توانید درخواست لغو معامله دهید و وجه پرداختی به حساب شما بازگردانده می‌شود.",
    },
    {
      question: "آیا می‌توانم قبل از آزادسازی وجه کالا را بررسی کنم؟",
      answer: "بله، شما یک دوره بازرسی توافق شده دارید تا کالا را بررسی کنید و در صورت عدم رضایت، آن را مرجوع کنید.",
    },
    {
      question: "چگونه می‌توانم یک معامله را لغو کنم؟",
      answer: "تا قبل از ارسال کالا توسط فروشنده، می‌توانید درخواست لغو دهید. پس از ارسال، لغو معامله منوط به توافق طرفین یا رد کالا در دوره بازرسی است.",
    },
  ],
  Sellers: [
    {
      question: "کارمزد فروش چقدر است؟",
      answer: "کارمزد فروش بسته به مبلغ معامله متغیر است و معمولاً بین ۱ تا ۲ درصد مبلغ کل معامله می‌باشد. می‌توانید از ماشین‌حساب کارمزد ما استفاده کنید.",
    },
    {
      question: "چه زمانی وجه را دریافت می‌کنم؟",
      answer: "وجه معامله پس از اینکه خریدار کالا را دریافت و تایید کرد، یا پس از اتمام دوره بازرسی بدون ثبت شکایت، فوراً به حساب شما آزاد می‌شود.",
    },
    {
      question: "چگونه ارسال کالا را اثبات کنم؟",
      answer: "باید شماره پیگیری پستی یا بارنامه معتبر را در پنل کاربری خود ثبت کنید تا سیستم وضعیت ارسال را رهگیری کند.",
    },
    {
      question: "اگر خریدار کالا را رد کند چه اتفاقی می‌افتد؟",
      answer: "خریدار باید کالا را با هزینه خود (مگر توافق دیگری باشد) به شما برگرداند. پس از دریافت و تایید سلامت کالا توسط شما، وجه به خریدار عودت داده می‌شود.",
    },
  ],
  Payments: [
    {
      question: "چه روش‌های پرداختی پشتیبانی می‌شود؟",
      answer: "ما از تمام کارت‌های عضو شتاب و درگاه‌های پرداخت اینترنتی معتبر پشتیبانی می‌کنیم.",
    },
    {
      question: "آیا محدودیتی در مبلغ تراکنش وجود دارد؟",
      answer: "برای مبالغ بسیار بالا ممکن است نیاز به تایید هویت تکمیلی باشد، اما به طور کلی سقف تراکنش‌ها مطابق با قوانین بانکی کشور است.",
    },
    {
      question: "بازگشت وجه چگونه انجام می‌شود؟",
      answer: "در صورت لغو معامله، وجه به همان شماره شبایی که در پروفایل خود ثبت کرده‌اید ظرف ۲۴ تا ۴۸ ساعت کاری واریز می‌شود.",
    },
    {
      question: "آیا می‌توانم از ارز دیجیتال استفاده کنم؟",
      answer: "در حال حاضر تنها پرداخت‌های ریالی پشتیبانی می‌شوند، اما امکان پرداخت با ارزهای دیجیتال در برنامه‌های توسعه آینده ما قرار دارد.",
    },
  ],
  Security: [
    {
      question: "چگونه از اطلاعات من محافظت می‌شود؟",
      answer:
        "اطلاعات شما با استفاده از پیشرفته‌ترین پروتکل‌های رمزنگاری محافظت می‌شود و هرگز بدون حکم قضایی در اختیار شخص ثالث قرار نمی‌گیرد.",
    },
    {
      question: "آیا اطلاعات شخصی من با طرف مقابل به اشتراک گذاشته می‌شود؟",
      answer: "خیر، تنها اطلاعات ضروری برای انجام معامله (مانند آدرس ارسال برای فروشنده) نمایش داده می‌شود و اطلاعات حساس بانکی کاملاً محرمانه می‌ماند.",
    },
    {
      question: "چگونه از کلاهبرداری جلوگیری می‌کنید؟",
      answer: "سیستم احراز هویت چندمرحله‌ای و نظارت بر تراکنش‌های مشکوک، ریسک کلاهبرداری را به حداقل می‌رساند. همچنین وجوه تا پایان معامله نزد ما امانت می‌ماند.",
    },
    {
      question: "آیا اتصال وب‌سایت امن است؟",
      answer: "بله، تمامی ارتباطات وب‌سایت با استفاده از گواهینامه SSL رمزنگاری شده است تا امنیت تبادل اطلاعات تضمین شود.",
    },
  ],
};

interface FaqListProps {
  searchTerm: string;
}

export default function FaqList({ searchTerm }: FaqListProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("General");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter FAQs based on search term
  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) {
      return faqs[activeCategory];
    }

    const term = searchTerm.toLowerCase().trim();
    // Search across ALL categories when searching
    const allFaqs = Object.values(faqs).flat();
    return allFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );
  }, [searchTerm, activeCategory]);

  // Show category tabs only when not searching
  const showTabs = !searchTerm.trim();

  return (
    <section className={styles.container}>
      {showTabs && (
        <div className={styles.tabsContainer}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.tab} ${
                activeCategory === category.id ? styles.active : ""
              }`}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenIndex(null);
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.listContainer}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.accordionItem} ${
                openIndex === index ? styles.open : ""
              }`}
            >
              <div
                className={styles.accordionHeader}
                onClick={() => handleToggle(index)}
              >
                <Typography className={styles.question}>
                  {faq.question}
                </Typography>
                <div
                  className={`${styles.icon} ${
                    openIndex === index ? styles.rotate : ""
                  }`}
                >
                  <ChevronIcon />
                </div>
              </div>
              <div className={styles.accordionContent}>
                <div className={styles.accordionContentInner}>
                  <Typography>{faq.answer}</Typography>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            <Typography>نتیجه‌ای یافت نشد</Typography>
          </div>
        )}
      </div>
    </section>
  );
}
