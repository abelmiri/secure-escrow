import { Button, Checkbox, CircularProgress } from "@mui/material"
import type { DealDetail } from "@/hooks/deals/useDeal"
import DealReview from "./DealReview"
import styles from "./styles/TransactionFormDetails.module.scss"

interface TransactionReviewStageProps {
  deal: DealDetail | null
  isDealLoading: boolean
  isSubmitting: boolean
  isTermsAccepted: boolean
  userMobile?: string
  role: string
  categoryName?: string
  subCategoryName: string
  title: string
  description: string
  escrowAmount: string
  totalTransactionAmount: string
  paymentMethod: string
  localDocuments: File[]
  onTermsAcceptedChange: (accepted: boolean) => void
  onPrevious?: () => void
  onSubmit: () => void
}

export default function TransactionReviewStage({
  deal,
  isDealLoading,
  isSubmitting,
  isTermsAccepted,
  userMobile,
  role,
  categoryName,
  subCategoryName,
  title,
  description,
  escrowAmount,
  totalTransactionAmount,
  paymentMethod,
  localDocuments,
  onTermsAcceptedChange,
  onPrevious,
  onSubmit,
}: TransactionReviewStageProps) {
  return (
    <>
      {isDealLoading ? (
        <div className={styles.reviewLoading}>
          <CircularProgress size={24} />
        </div>
      ) : (
        <div className={styles.reviewContainer}>
          <DealReview
            deal={deal}
            userMobile={userMobile}
            role={role}
            categoryName={categoryName}
            subCategoryName={subCategoryName}
            title={title}
            description={description}
            escrowAmount={escrowAmount}
            totalTransactionAmount={totalTransactionAmount}
            paymentMethod={paymentMethod}
            localDocuments={localDocuments}
          />
        </div>
      )}

      <div className={styles.termsRow}>
        <Checkbox
          checked={isTermsAccepted}
          onChange={(event) => onTermsAcceptedChange(event.target.checked)}
          className={styles.termsCheckbox}
        />
        <span>
          من با{" "}
          <a href="/terms" target="_blank" rel="noreferrer">
            شرایط استفاده
          </a>{" "}
          و{" "}
          <a href="/escrow-agreement" target="_blank" rel="noreferrer">
            قرارداد اسکرو
          </a>{" "}
          موافقم و تایید می‌کنم که معامله پس از تایید طرف دیگر ادامه خواهد یافت.
        </span>
      </div>

      <div className={styles.buttonGroup}>
        {onPrevious && (
          <Button
            variant="outlined"
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            قبلی
          </Button>
        )}
        <Button
          className={`${styles.buttonPrimary} ${styles.submitReviewButton}`}
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting || isDealLoading || !isTermsAccepted}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "ارسال برای تایید خریدار"
          )}
        </Button>
      </div>
    </>
  )
}
