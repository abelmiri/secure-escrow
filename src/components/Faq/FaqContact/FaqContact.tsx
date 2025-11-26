import React from "react";
import { Box, Typography, Button } from "@mui/material";
import styles from "./styles/FaqContact.module.scss";
import ChatIcon from "@/media/svg/ChatIcon";

export default function FaqContact() {
  return (
    <section className={styles.container}>
      <div className={styles.iconWrapper}>
        <ChatIcon width="64" height="64" color="#155DFC" />
      </div>
      
      <Typography variant="h2" className={styles.title}>
        هنوز سوالی دارید؟
      </Typography>
      
      <Typography variant="body1" className={styles.description}>
        تیم پشتیبانی ما به‌صورت ۲۴ ساعته آماده پاسخگویی به شماست
      </Typography>

      <div className={styles.buttonGroup}>
        <Button className={styles.buttonPrimary} variant="contained">
          تماس با پشتیبانی
        </Button>
        <Button className={styles.buttonSecondary} variant="outlined">
          مرکز راهنما
        </Button>
      </div>
    </section>
  );
}

