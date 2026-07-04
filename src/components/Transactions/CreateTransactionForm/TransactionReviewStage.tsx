import { Button, Checkbox, CircularProgress } from "@mui/material"
import type { DealDetail } from "@/hooks/deals/useDeal"
import type { UploadedDealDocument } from "@/hooks/documents/useDealDocuments"
import DealReview from "./DealReview"
import styles from "./styles/TransactionFormDetails.module.scss"

interface TransactionReviewStageProps {
  deal: DealDetail | null
  contractDocument: UploadedDealDocument | null
  documents: UploadedDealDocument[]
  isDealLoading: boolean
  isContractPdfLoading: boolean
  isDocumentsLoading: boolean
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
  contractDocument,
  documents,
  isDealLoading,
  isContractPdfLoading,
  isDocumentsLoading,
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
  const isReviewLoading =
    isDealLoading || isContractPdfLoading || isDocumentsLoading

  return (
    <>
      {isReviewLoading ? (
        <div className={styles.reviewLoading}>
          <CircularProgress size={24} />
        </div>
      ) : (
        <div className={styles.reviewContainer}>
          <DealReview
            deal={deal}
            contractDocument={contractDocument}
            documents={documents}
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
          <a href="/terms-and-conditions" target="_blank" rel="noreferrer">
            شرایط استفاده، قوانین و قرارداد عمومی معاملات امانی امان‌یار
          </a>{" "}
          موافقم و تأیید می‌کنم که معامله با تأیید طرف دیگر ادامه خواهد یافت.
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
          disabled={isSubmitting || isReviewLoading || !isTermsAccepted}
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
