import Image from "next/image"
import { Box } from "@mui/material"
import TrustedBanner from "@/components/Landing/TrustedBanner/TrustedBanner"
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading"
import LandingHeadingDescription from "@/components/Landing/LandingHeadingDescription/LandingHeadingDescription"
import landingSafe from "@/media/picture/landing-safe.png"
import LandingStartButtons from "@/components/Landing/LandingStartButtons/LandingStartButtons"
import LandingInfoStats from "@/components/Landing/LandingInfoStats/LandingInfoStats"
import styles from "./styles/LandingInfo.module.scss"

export default function LandingInfo() {
  return (
    <Box className={styles.landingInfo}>
      <Box className={styles.contentContainer}>
        <Box className={styles.leftSection}>
          <TrustedBanner />
          <LandingHeading />
          <LandingHeadingDescription />
          <LandingStartButtons />
          <LandingInfoStats />
        </Box>
        <Box className={styles.rightSection}>
          <Box className={styles.imageContainer}>
            <Image
              src={landingSafe}
              alt="Landing Safe"
              width={0}
              height={0}
              sizes="100vw"
              className={styles.landingSafeImage}
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
