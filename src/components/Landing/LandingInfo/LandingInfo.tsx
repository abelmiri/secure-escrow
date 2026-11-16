import { Box } from "@mui/material"
import Image from "next/image"
import TrustedBanner from "@/components/Landing/TrustedBanner/TrustedBanner"
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading"
import LandingHeadingDescription from "@/components/Landing/LandingHeadingDescription/LandingHeadingDescription"
import LandingStartButtons from "@/components/Landing/LandingStartButtons/LandingStartButtons"
import LandingForm from "@/components/Landing/LandingForm/LandingForm"
import heroImage from "@/media/picture/contact-workspace.jpg"
import styles from "./styles/LandingInfo.module.scss"

export default function LandingInfo() {
  return (
    <Box className={styles.landingInfo}>
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.backgroundImage}
      />
      <Box className={styles.backgroundOverlay} aria-hidden="true" />
      <Box className={styles.contentContainer}>
        <Box className={styles.leftSection}>
          <TrustedBanner />
          <LandingHeading />
          <LandingHeadingDescription />
          <LandingStartButtons />
          {/* <LandingInfoStats /> */}
        </Box>
        <Box className={styles.rightSection}>
          <LandingForm />
        </Box>
      </Box>
    </Box>
  )
}
