"use client";

import { Button, Box } from "@mui/material";
import styles from "./styles/HomePageButtons.module.scss";

export default function HomePageButtons() {
  return (
    <Box className={styles.buttonContainer}>
      <Button variant="contained" className={styles.primaryButton}>
        First Color
      </Button>
      <Button variant="outlined" className={styles.secondaryButton}>
        Secondary Color
      </Button>
      <Button variant="contained" className={styles.thirdButton}>
        Third Color
      </Button>
    </Box>
  );
}

