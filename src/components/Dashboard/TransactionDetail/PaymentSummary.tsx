import { Box, Typography } from "@mui/material"
import type { Deal } from "@/constants/deals"
import CustomCheckIcon from "./CustomCheckIcon"
import styles from "./styles/TransactionDetail.module.scss"

export default function PaymentSummary({ deal }: { deal: Deal }) {
  return (
    <Box className={styles.sectionCard}>
      <Typography variant="h3" className={styles.sectionTitle}>
        خلاصه پرداخت
      </Typography>
      <Box className={styles.paymentContent}>
        <Box className={styles.paymentRow}>
          <Typography className={styles.paymentLabel}>مبلغ امانی</Typography>
          <Typography className={styles.paymentValue}>
            {deal.amount} {deal.currency || "تومان"}
          </Typography>
        </Box>
        {deal.serviceFee && (
          <Box className={styles.paymentRow}>
            <Typography className={styles.paymentLabel}>
              کارمزد سرویس امانی (۲.۵٪)
            </Typography>
            <Typography className={styles.paymentValue}>
              {deal.serviceFee} {deal.currency || "تومان"}
            </Typography>
          </Box>
        )}
        <Box className={`${styles.paymentRow} ${styles.paymentTotal}`}>
          <Typography className={styles.paymentLabel}>مجموع</Typography>
          <Typography className={styles.paymentValue}>
            {deal.totalAmount || deal.amount} {deal.currency || "تومان"}
          </Typography>
        </Box>
        {deal.paymentStatus && (
          <Box className={styles.paymentStatusBox}>
            <CustomCheckIcon className={styles.paymentStatusIcon} />
            <Typography className={styles.paymentStatusText}>
              {deal.paymentStatus}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
