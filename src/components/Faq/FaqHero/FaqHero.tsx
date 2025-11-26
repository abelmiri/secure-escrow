import React from "react";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@/media/svg/SearchIcon";
import styles from "./styles/FaqHero.module.scss";

interface FaqHeroProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function FaqHero({ searchTerm, onSearchChange }: FaqHeroProps) {
  return (
    <Box className={styles.container}>
      <Typography variant="h1" className={styles.title}>
        سوالات متداول
      </Typography>
      
      <Typography variant="body1" className={styles.description}>
        پاسخ سوالات متداول درباره سرویس‌های اسکرو را پیدا کنید
      </Typography>

      <Box className={styles.searchContainer}>
        <div className={styles.searchIcon}>
          <SearchIcon color="#BEDBFF" />
        </div>
        <input
          type="text"
          placeholder="جستجو در سوالات..."
          className={styles.input}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Box>
    </Box>
  );
}
