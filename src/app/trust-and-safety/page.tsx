import React from "react";
import TrustAndSafetyHero from "@/components/TrustAndSafety/TrustAndSafetyHero/TrustAndSafetyHero";
import TrustAndSafetyFeatures from "@/components/TrustAndSafety/TrustAndSafetyFeatures/TrustAndSafetyFeatures";
import TrustAndSafetyProtection from "@/components/TrustAndSafety/TrustAndSafetyProtection/TrustAndSafetyProtection";
import TrustAndSafetyTips from "@/components/TrustAndSafety/TrustAndSafetyTips/TrustAndSafetyTips";

export default function TrustAndSafetyPage() {
  return (
    <main>
      <TrustAndSafetyHero />
      <TrustAndSafetyFeatures />
      <TrustAndSafetyProtection />
      <TrustAndSafetyTips />
    </main>
  );
}

