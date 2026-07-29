import { Box, Typography } from "@mui/material"
import type { Deal } from "@/constants/deals"
import styles from "./styles/TransactionDetail.module.scss"

function DetailRow({
  label,
  value,
  full = false,
}: {
  label: string
  value?: string
  full?: boolean
}) {
  if (!value) return null

  return (
    <Box
      className={`${styles.detailRow} ${full ? styles.detailRowFull : ""}`}
    >
      <Typography className={styles.detailLabel}>{label}</Typography>
      <Typography className={styles.detailValue}>{value}</Typography>
    </Box>
  )
}

export default function TransactionDetailsTab({ deal }: { deal: Deal }) {
  return (
    <Box className={styles.detailsContainer}>
      <DetailRow label="شناسه معامله" value={deal.id} />
      <DetailRow label="عنوان" value={deal.title} />
      <DetailRow label="وضعیت" value={deal.status} />
      <DetailRow label="نقش شما" value={deal.role} />
      <DetailRow label="تاریخ ایجاد" value={deal.date} />
      {deal.details && (
        <>
          <DetailRow label="دسته‌بندی" value={deal.details.category} />
          <DetailRow label="توضیحات" value={deal.details.description} />
          <DetailRow label="مکان" value={deal.details.location} />
          <DetailRow label="روش تحویل" value={deal.details.deliveryMethod} />
          <DetailRow
            label="دوره بازرسی"
            value={deal.details.inspectionPeriod}
          />
          <DetailRow label="شرایط و ضوابط" value={deal.details.terms} full />
          {deal.details.additionalDetails?.map((detail) => (
            <DetailRow
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </>
      )}
    </Box>
  )
}
