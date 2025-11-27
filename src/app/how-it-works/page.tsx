import React from "react";
import HowItWorksHero from "@/components/HowItWorks/HowItWorksHero/HowItWorksHero";
import HowItWorksSteps from "@/components/HowItWorks/HowItWorksSteps/HowItWorksSteps";
import HowItWorksFeatures from "@/components/HowItWorks/HowItWorksFeatures/HowItWorksFeatures";
import ReadyToStart from "@/components/Landing/ReadyToStart/ReadyToStart";

export default function HowItWorksPage() {
  return (
    <main>
      <HowItWorksHero />
      <HowItWorksSteps />
      <HowItWorksFeatures />
      <ReadyToStart howItWorks={true} />
    </main>
  );
}
