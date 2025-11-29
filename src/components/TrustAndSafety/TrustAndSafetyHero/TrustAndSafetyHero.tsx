import React from "react";
import { Box, Typography } from "@mui/material";
import Shield from "@/media/svg/Shield";
import styles from "./styles/TrustAndSafetyHero.module.scss";

export default function TrustAndSafetyHero() {
  return (
    <Box className={styles.container}>
      <Box className={styles.iconWrapper}>
        <Shield width={80} height={80} strokeColor="white" />
      </Box>
      
      <Typography variant="h1" className={styles.title}>
        اعتماد و امنیت
      </Typography>
      
      <Typography variant="body1" className={styles.description}>
        امنیت شما اولویت اصلی ماست. بیاموزید چگونه از هر تراکنش محافظت می‌کنیم.
      </Typography>
    </Box>
  );
}

