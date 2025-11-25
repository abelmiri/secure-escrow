"use client"

import { Box, Typography } from "@mui/material"
import styles from "./styles/TrustedPartnersCard.module.scss"

const defaultPartners: string[] = [
  "VISA",
  "MasterCard",
  "PayPal",
  "Stripe",
  "American Express",
]

export default function TrustedPartnersCard() {
  return (
    <Box className={styles.card}>
      <Typography className={styles.title}>شرکای پرداخت معتبر</Typography>
      <Box className={styles.partnersContainer}>
        {defaultPartners.map((partner, index) => (
          <Typography
            key={`${partner}-${index}`}
            className={styles.partnerName}
          >
            {partner}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}
