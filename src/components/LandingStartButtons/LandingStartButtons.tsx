"use client"

import { Button, Box } from "@mui/material"
import type { LandingStartButtonsProps } from "./types"
import SmallArrow from "@/media/svg/SmallArrow"
import styles from "./styles/LandingStartButtons.module.scss"
import loginOAUTH from "@/helpers/auth/loginOAUTH"

export default function LandingStartButtons({
  className,
}: LandingStartButtonsProps) {
  function login() {
    loginOAUTH()
  }

  return (
    <Box className={`${styles.buttonContainer} ${className || ""}`}>
      <Button variant="outlined" className={styles.button} onClick={login}>
        Get Started
        <Box className={styles.iconWrapper}>
          <SmallArrow
            width={16}
            height={16}
            strokeColor="var(--color-secondary)"
          />
        </Box>
      </Button>
      <Button variant="outlined" className={styles.button}>
        {/* Second button content - to be specified */}
      </Button>
    </Box>
  )
}
