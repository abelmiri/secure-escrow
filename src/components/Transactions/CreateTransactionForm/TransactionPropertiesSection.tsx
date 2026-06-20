import type { ReactNode } from "react"
import { CircularProgress } from "@mui/material"
import styles from "./styles/TransactionFormDetails.module.scss"

interface TransactionPropertiesSectionProps {
  stageNumber: number
  isLoading: boolean
  hasItems: boolean
  subCategoryName: string
  subCategoryDescription: string
  children: ReactNode
}

export default function TransactionPropertiesSection({
  stageNumber,
  isLoading,
  hasItems,
  subCategoryName,
  subCategoryDescription,
  children,
}: TransactionPropertiesSectionProps) {
  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <CircularProgress size={24} />
      </div>
    )
  }

  if (!hasItems) return null

  const isDocumentStage = stageNumber === 2

  return (
    <section className={styles.propertiesBox}>
      <div className={styles.propertiesHeader}>
        <div className={styles.propertiesTitle}>
          {isDocumentStage ? "بارگذاری اسناد" : subCategoryName}
        </div>
        {isDocumentStage ? (
          <div className={styles.propertiesDescription}>
            فایل‌های مورد نیاز برای بارگذاری را انتخاب کنید
          </div>
        ) : (
          subCategoryDescription && (
            <div className={styles.propertiesDescription}>
              {subCategoryDescription}
            </div>
          )
        )}
      </div>

      <div className={styles.propertiesGrid}>{children}</div>
    </section>
  )
}
