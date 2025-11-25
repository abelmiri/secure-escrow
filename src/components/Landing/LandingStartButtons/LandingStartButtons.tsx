"use client"

import { Button, Box } from "@mui/material"
import SmallArrow from "@/media/svg/SmallArrow"
import styles from "./styles/LandingStartButtons.module.scss"
import loginOAUTH from "@/helpers/auth/loginOAUTH"

export default function LandingStartButtons() {
  function login() {
    loginOAUTH()
  }

  return (
    <Box className={styles.buttonContainer}>
      <Button variant="outlined" className={styles.button} onClick={login}>
        شروع کنید
        <Box className={styles.iconWrapper}>
          <SmallArrow
            width={16}
            height={16}
            strokeColor="var(--color-secondary)"
          />
        </Box>
      </Button>
      {/* <Button variant="outlined" className={styles.button}> */}
        {/* Second button content - to be specified */}
      {/* </Button> */}
    </Box>
  )
}
