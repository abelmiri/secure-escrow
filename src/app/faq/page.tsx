"use client";

import React, { useState } from "react";
import FaqHero from "@/components/Faq/FaqHero/FaqHero";
import FaqList from "@/components/Faq/FaqList/FaqList";
import FaqContact from "@/components/Faq/FaqContact/FaqContact";

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <FaqHero searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <FaqList searchTerm={searchTerm} />
      <FaqContact />
    </main>
  );
}
