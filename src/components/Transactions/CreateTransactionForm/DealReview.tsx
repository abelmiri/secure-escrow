import type { ReactNode } from "react"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined"
import type { DealDetail, DealDocument, DealItem } from "@/hooks/deals/useDeal"
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

const getDocumentName = (document: DealDocument) =>
  document.title || document.name || "سند معامله"

const getDocumentMeta = (document: DealDocument) => {
  const size = document.file_size || document.size
  const rawDate = document.uploaded_at || document.created_at
  const parsedDate = rawDate ? new Date(rawDate) : null
  const date =
    rawDate && parsedDate && !Number.isNaN(parsedDate.getTime())
      ? new Intl.DateTimeFormat("fa-IR").format(parsedDate)
      : rawDate || ""

  return [size ? `${size}` : "", date].filter(Boolean).join(" • ")
}

interface ReviewRow {
  label: string
  value?: ReactNode
}

interface ReviewSectionProps {
  title: string
  rows: ReviewRow[]
}

interface DealReviewProps {
  deal: DealDetail | null
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
        {rows.map((row) => (
          <div key={row.label} className={styles.reviewRow}>
            <div className={styles.reviewLabel}>{row.label}</div>
            <div className={styles.reviewValue}>{row.value || "—"}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DealReview({
  deal,
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
    deal?.parties?.find((party) => party.user === userMobile)?.role || role
  const counterparty = deal?.parties?.find(
    (party) => party.role && party.role !== currentRole,
  )
  const itemProperties = item?.properties
    ? Object.entries(item.properties).filter(([, value]) => value !== "")
    : []
  const documents = deal?.documents || []
  const escrowValue = item?.price ?? escrowAmount
  const totalValue =
    item?.total_price ?? (totalTransactionAmount || escrowValue)
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
                : String(itemProperties[0][1]),
          },
          { label: "تعداد:", value: item?.quantity?.toString() },
          ...itemProperties.slice(1).map(([key, value]) => ({
            label: `${key}:`,
            value:
              typeof value === "boolean"
                ? value
                  ? "دارد"
                  : "ندارد"
                : `${value}`,
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
        title="اطلاعات خریدار"
        rows={[
          { label: "ایمیل خریدار:", value: counterparty?.email || "" },
          {
            label: "نماینده فروشنده:",
            value: currentRole === "broker" ? "بله" : "خیر",
          },
        ]}
      />

      <section className={styles.reviewSection}>
        <h3 className={styles.reviewSectionTitle}>قرارداد و اسناد معامله</h3>
        <div className={styles.documentList}>
          {documents.length > 0 ? (
            documents.map((document) => (
              <a
                key={document.id || getDocumentName(document)}
                href={document.url || document.file || "#"}
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
          ) : (
            <div className={styles.emptyReview}>سندی برای نمایش وجود ندارد</div>
          )}
        </div>
      </section>

      <div className={styles.feeNotice}>
        <div className={styles.feeTitle}>هزینه های حساب امانی و امان‌یار</div>
        <div>مبلغ حساب امانی: {formatCurrency(escrowValue)}</div>
        <div>کارمزد امان‌یار (۲.۵٪): {formatCurrency(0)}</div>
        <strong>مجموعه هزینه های قابل پرداخت: {formatCurrency(0)}</strong>
      </div>
    </>
  )
}
