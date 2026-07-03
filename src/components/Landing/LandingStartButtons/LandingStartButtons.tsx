"use client"

import { Button, Box } from "@mui/material"
import { useRouter } from "next/navigation"
import useUser from "@/context/auth/hooks/useUser"
import loginOAUTH from "@/helpers/auth/loginOAUTH"
import SmallArrow from "@/media/svg/SmallArrow"
import styles from "./styles/LandingStartButtons.module.scss"

export default function LandingStartButtons() {
  const router = useRouter()
  const { isLoggedIn } = useUser()

  const handleStart = () => {
    if (isLoggedIn) {
      router.push("/contracts/create")
      return
    }

    loginOAUTH({ redirect: true, returnTo: "/contracts/create" })
  }

  return (
    <Box className={styles.buttonContainer}>
      <Button
        variant="outlined"
        className={styles.button}
        onClick={handleStart}
      >
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
