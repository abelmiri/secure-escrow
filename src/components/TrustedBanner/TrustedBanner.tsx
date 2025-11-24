"use client";

import { Box, Typography } from "@mui/material";
import type { TrustedBannerProps } from "./types";
import TrustedBadge from "@/media/svg/TrustedBadge";
import styles from "./styles/TrustedBanner.module.scss";

export default function TrustedBanner({
  className,
  text = "Trusted by 500,000+ users worldwide",
}: TrustedBannerProps) {
  return (
    <Box className={`${styles.trustedBanner} ${className || ""}`}>
      <TrustedBadge width={16} height={16} className={styles.icon} />
      <Typography className={styles.text}>{text}</Typography>
    </Box>
  );
}

