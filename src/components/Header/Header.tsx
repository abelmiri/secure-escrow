"use client";

import { Box } from "@mui/material";
import type { HeaderProps } from "./types";
import SecureEscrow from "@/media/svg/SecureEscrow";
import styles from "./styles/Header.module.scss";

export default function Header({ className }: HeaderProps) {
  return (
    <Box component="header" className={`${styles.header} ${className || ""}`}>
      <Box className={styles.iconContainer}>
        <SecureEscrow
          width={20}
          height={20}
          className={styles.icon}
          strokeColor="white"
        />
      </Box>
    </Box>
  );
}

