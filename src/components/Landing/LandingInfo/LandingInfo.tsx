import { Box } from "@mui/material"
import TrustedBanner from "@/components/Landing/TrustedBanner/TrustedBanner"
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading"
import LandingHeadingDescription from "@/components/Landing/LandingHeadingDescription/LandingHeadingDescription"
import LandingStartButtons from "@/components/Landing/LandingStartButtons/LandingStartButtons"
import LandingForm from "@/components/Landing/LandingForm/LandingForm"
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
          {/* <LandingInfoStats /> */}
        </Box>
        <Box className={styles.rightSection}>
          <LandingForm />
        </Box>
      </Box>
    </Box>
  )
}
