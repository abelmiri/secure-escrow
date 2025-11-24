"use client";

import { Typography } from "@mui/material";
import type { LandingHeadingDescriptionProps } from "./types";
import styles from "./styles/LandingHeadingDescription.module.scss";

export default function LandingHeadingDescription({
  className,
  text = "The world's most trusted escrow platform. Buy and sell with confidence, protected by our secure payment system and professional support.",
}: LandingHeadingDescriptionProps) {
  return (
    <Typography className={`${styles.description} ${className || ""}`}>
      {text}
    </Typography>
  );
}

