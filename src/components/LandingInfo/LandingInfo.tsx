"use client";

import Image from "next/image";
import { Box } from "@mui/material";
import type { LandingInfoProps } from "./types";
import TrustedBanner from "@/components/TrustedBanner";
import LandingHeading from "@/components/LandingHeading";
import LandingHeadingDescription from "@/components/LandingHeadingDescription";
import LandingStartButtons from "@/components/LandingStartButtons";
import LandingInfoStats from "@/components/LandingInfoStats";
import styles from "./styles/LandingInfo.module.scss";

export default function LandingInfo({ className }: LandingInfoProps) {
  return (
    <Box className={`${styles.landingInfo} ${className || ""}`}>
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
              src="/media/picture/landing safe.png"
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
  );
}

