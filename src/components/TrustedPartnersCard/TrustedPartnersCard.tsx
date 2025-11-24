"use client";

import { Box, Typography } from "@mui/material";
import type { TrustedPartnersCardProps } from "./types";
import styles from "./styles/TrustedPartnersCard.module.scss";

const defaultPartners: string[] = [
  "VISA",
  "MasterCard",
  "PayPal",
  "Stripe",
  "American Express",
];

export default function TrustedPartnersCard({
  className,
  title = "Trusted payment partners",
  partners = defaultPartners,
}: TrustedPartnersCardProps) {
  return (
    <Box className={`${styles.card} ${className || ""}`}>
      <Typography className={styles.title}>{title}</Typography>
      <Box className={styles.partnersContainer}>
        {partners.map((partner, index) => (
          <Typography key={`${partner}-${index}`} className={styles.partnerName}>
            {partner}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

