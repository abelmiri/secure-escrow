import type { Metadata } from "next"

import { getTermsContent } from "@/content/terms"
import styles from "./page.module.scss"

export const metadata: Metadata = {
  title: "قوانین و مقررات | امان یار",
  description:
    "شرایط استفاده، قوانین و قرارداد عمومی خدمات معاملات امانی و پرداخت امن امان یار",
}

type Section = {
  title: string
  paragraphs: string[]
}

function parseTerms(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const documentTitle = lines.shift() ?? ""
  const sections: Section[] = []

  for (const line of lines) {
    if (line === "مقدمه" || line.startsWith("ماده ")) {
      sections.push({ title: line, paragraphs: [] })
      continue
    }

    sections.at(-1)?.paragraphs.push(line)
  }

  return { documentTitle, sections }
}

export default function TermsPage() {
  const { documentTitle, sections } = parseTerms(getTermsContent())

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <h1>قوانین و مقررات</h1>
        <p>شرایط استفاده از خدمات معاملات امانی و پرداخت امن</p>
      </header>

      <div className={styles.contentWrapper}>
        <article className={styles.document}>
          <div className={styles.documentHeader}>
            <span className={styles.documentLabel}>قرارداد عمومی</span>
            <h2>{documentTitle}</h2>
          </div>

          <div className={styles.sections}>
            {sections.map((section) => (
              <section
                className={styles.section}
                key={section.title}
                id={
                  section.title === "مقدمه"
                    ? "introduction"
                    : `article-${
                        section.title.replace(/^ماده\s+/, "").split(".")[0]
                      }`
                }
              >
                <h3>{section.title}</h3>
                <div className={styles.paragraphs}>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.title}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  )
}
