import type { ReactNode } from "react"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined"
import {
  getPartyMobileNumber,
  type DealDetail,
  type DealItem,
} from "@/hooks/deals/useDeal"
import type { UploadedDealDocument } from "@/hooks/documents/useDealDocuments"
import IranLocationPicker, {
  isMapLocationValue,
} from "./IranLocationPicker"
import styles from "./styles/TransactionFormDetails.module.scss"

const roleLabels: Record<string, string> = {
  customer: "خریدار",
  beneficiary: "فروشنده",
  broker: "کارگزار",
}

const paymentMethodLabels: Record<string, string> = {
  Cash: "پرداخت نقدی/کارت‌به‌کارت",
  Escrow: "واریز به حساب امانی در مرحله بعدی",
  Cheque: "ارائه چک صیادی",
  Change: "تهاتر یا معاوضه",
}

const formatCurrency = (value?: number | string | null) => {
  const numericValue = Number(value || 0)
  return `${Number.isFinite(numericValue) ? numericValue.toLocaleString("fa-IR") : "۰"} ریال`
}

const getItemSubcategory = (item?: DealItem | null) => {
  if (!item?.subcategory) return ""
  if (typeof item.subcategory === "string") return item.subcategory
  return item.subcategory.name || item.subcategory.slug || ""
}

const getDocumentName = (document: UploadedDealDocument) =>
  document.document_name || document.file_name || "سند معامله"

const formatFileSize = (size: number) => {
  if (!size) return ""
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

const getDocumentMeta = (document: UploadedDealDocument) => {
  const size = formatFileSize(document.file_size)
  const fileType = document.file_type?.toUpperCase()
  const rawDate = document.created_at
  const parsedDate = rawDate ? new Date(rawDate) : null
  const date =
    rawDate && parsedDate && !Number.isNaN(parsedDate.getTime())
      ? new Intl.DateTimeFormat("fa-IR").format(parsedDate)
      : rawDate || ""

  return [fileType, size, date, document.uploader]
    .filter(Boolean)
    .join(" • ")
}

const formatPropertyValue = (value: unknown) => {
  if (typeof value === "boolean") return value ? "دارد" : "ندارد"
  if (Array.isArray(value)) return value.join("، ")
  return `${value}`
}

const renderPropertyValue = (value: unknown) =>
  isMapLocationValue(value) ? (
    <IranLocationPicker title="" value={value} readOnly />
  ) : (
    formatPropertyValue(value)
  )

interface ReviewRow {
  label: string
  value?: ReactNode
}

interface ReviewSectionProps {
  title: string
  rows: ReviewRow[]
}

const isPhoneNumber = (value: ReactNode) => {
  if (typeof value !== "string") return false

  const normalizedValue = value.replace(/[\s-]/g, "")
  return /^(?:09[0-9]{9}|\+989[0-9]{9}|00989[0-9]{9})$/.test(
    normalizedValue,
  )
}

interface DealReviewProps {
  deal: DealDetail | null
  contractDocument: UploadedDealDocument | null
  documents: UploadedDealDocument[]
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
}

function ReviewSection({ title, rows }: ReviewSectionProps) {
  return (
    <section className={styles.reviewSection}>
      <h3 className={styles.reviewSectionTitle}>{title}</h3>
      <div className={styles.reviewRows}>
        {rows.map((row) => {
          const value = row.value || "—"

          return (
            <div key={row.label} className={styles.reviewRow}>
              <div className={styles.reviewLabel}>{row.label}</div>
              <div
                className={`${styles.reviewValue} ${
                  isPhoneNumber(value) ? styles.reviewValueLtr : ""
                }`}
              >
                {value}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function DealReview({
  deal,
  contractDocument,
  documents,
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
}: DealReviewProps) {
  const item = deal?.items?.[0]
  const currentRole =
    deal?.parties?.find((party) => getPartyMobileNumber(party) === userMobile)
      ?.role || role
  const counterparty = deal?.parties?.find(
    (party) => party.role && party.role !== currentRole,
  )
  const counterpartyRoleLabel = counterparty?.role
    ? roleLabels[counterparty.role] || "طرف مقابل"
    : "طرف مقابل"
  const counterpartyMobile = getPartyMobileNumber(counterparty)
  const itemProperties = item?.properties
    ? Object.entries(item.properties).filter(([, value]) => value !== "")
    : []
  const escrowValue = item?.escrow_price ?? escrowAmount
  const totalValue = item?.price ?? (totalTransactionAmount || escrowValue)
  const remainingPayment =
    item?.remaining_price_payment_method || paymentMethod || ""

  return (
    <>
      <ReviewSection
        title="اطلاعات پایه"
        rows={[
          {
            label: "نقش شما:",
            value: roleLabels[currentRole] || roleLabels[role] || currentRole,
          },
          {
            label: "دسته‌بندی:",
            value: getItemSubcategory(item) || categoryName || subCategoryName,
          },
          { label: "عنوان:", value: item?.name || title },
          { label: "توضیحات:", value: item?.description || description },
        ]}
      />

      <ReviewSection
        title="اطلاعات کالا"
        rows={[
          { label: "نوع کالا:", value: getItemSubcategory(item) },
          { label: "نام کالا:", value: item?.name || title },
          {
            label: "وضعیت:",
            value:
              itemProperties[0]?.[1] === undefined
                ? ""
                : renderPropertyValue(itemProperties[0][1]),
          },
          { label: "تعداد:", value: item?.quantity?.toString() },
          ...itemProperties.slice(1).map(([key, value]) => ({
            label: `${key}:`,
            value: renderPropertyValue(value),
          })),
        ].filter((row) => row.value)}
      />

      <ReviewSection
        title="جزئیات مالی"
        rows={[
          {
            label: "مبلغ حساب امانی:",
            value: formatCurrency(escrowValue),
          },
          {
            label: "مبلغ کل معامله:",
            value: formatCurrency(totalValue),
          },
          {
            label: "شیوه پرداخت باقی‌مانده:",
            value:
              paymentMethodLabels[remainingPayment] ||
              remainingPayment ||
              (Number(totalValue) > Number(escrowValue) ? "ثبت نشده" : ""),
          },
        ]}
      />

      <ReviewSection
        title="جزئیات ارسال"
        rows={[
          { label: "نحوه ارسال:", value: "freight" },
          { label: "هزینه ارسال:", value: formatCurrency(0) },
          { label: "پرداخت‌کننده:", value: "" },
        ]}
      />

      <ReviewSection
        title={`اطلاعات ${counterpartyRoleLabel}`}
        rows={[
          {
            label: `شماره موبایل ${counterpartyRoleLabel}:`,
            value: counterpartyMobile,
          },
          {
            label: "نماینده فروشنده:",
            value: currentRole === "broker" ? "بله" : "خیر",
          },
        ]}
      />

      <section className={styles.reviewSection}>
        <h3 className={styles.reviewSectionTitle}>قرارداد و اسناد معامله</h3>
        <div className={styles.documentList}>
          {contractDocument && (
            <a
              href={contractDocument.download_url}
              className={styles.documentItem}
              target="_blank"
              rel="noreferrer"
            >
              <DownloadOutlinedIcon className={styles.documentActionIcon} />
              <div className={styles.documentInfo}>
                <DescriptionOutlinedIcon className={styles.documentIcon} />
                <div>
                  <div className={styles.documentName}>
                    {getDocumentName(contractDocument)}
                  </div>
                  <div className={styles.documentMeta}>
                    {getDocumentMeta(contractDocument)}
                  </div>
                </div>
              </div>
            </a>
          )}

          {documents.length > 0 ? (
            documents.map((document) => (
              <a
                key={document.id || getDocumentName(document)}
                href={document.download_url || "#"}
                className={styles.documentItem}
                target="_blank"
                rel="noreferrer"
              >
                <DownloadOutlinedIcon className={styles.documentActionIcon} />
                <div className={styles.documentInfo}>
                  <DescriptionOutlinedIcon className={styles.documentIcon} />
                  <div>
                    <div className={styles.documentName}>
                      {getDocumentName(document)}
                    </div>
                    <div className={styles.documentMeta}>
                      {getDocumentMeta(document)}
                    </div>
                  </div>
                </div>
              </a>
            ))
          ) : localDocuments.length > 0 ? (
            localDocuments.map((file) => (
              <div key={file.name} className={styles.documentItem}>
                <DownloadOutlinedIcon className={styles.documentActionIcon} />
                <div className={styles.documentInfo}>
                  <DescriptionOutlinedIcon className={styles.documentIcon} />
                  <div>
                    <div className={styles.documentName}>{file.name}</div>
                    <div className={styles.documentMeta}>
                      {(file.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : !contractDocument ? (
            <div className={styles.emptyReview}>سندی برای نمایش وجود ندارد</div>
          ) : null}
        </div>
      </section>

      <div className={styles.feeNotice}>
        <div className={styles.feeTitle}>هزینه های حساب امانی و امان‌یار</div>
        <div>مبلغ حساب امانی: {formatCurrency(escrowValue)}</div>
        <div>کارمزد امان‌یار (۲.۵٪)</div>
        {/* <strong>مجموعه هزینه های قابل پرداخت: {formatCurrency(0)}</strong> */}
      </div>
    </>
  )
}
