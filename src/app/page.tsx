"use client"

import LandingInfo from "@/components/Landing/LandingInfo/LandingInfo"
import TrustedPartnersCard from "@/components/Landing/TrustedPartnersCard/TrustedPartnersCard"
import HowItWorks from "@/components/Landing/HowItWorks/HowItWorks"
import WhyChooseUs from "@/components/Landing/WhyChooseUs/WhyChooseUs"
import PerfectTransaction from "@/components/Landing/PerfectTransaction/PerfectTransaction"
import Testimonials from "@/components/Landing/Testimonials/Testimonials"
import ReadyToStart from "@/components/Landing/ReadyToStart/ReadyToStart"

export default function HomePage() {
  return (
    <>
      <LandingInfo />
      <TrustedPartnersCard />
      <HowItWorks />
      <WhyChooseUs />
      <PerfectTransaction />
      <Testimonials />
      <ReadyToStart />
    </>
  )
}
