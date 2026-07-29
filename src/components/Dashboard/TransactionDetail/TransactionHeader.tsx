import { Box, Typography } from "@mui/material"
import type { Deal } from "@/constants/deals"
import styles from "./styles/TransactionDetail.module.scss"

interface TransactionHeaderProps {
  deal: Deal
}

export default function TransactionHeader({ deal }: TransactionHeaderProps) {
  return (
    <Box className={styles.header}>
      <Box className={styles.headerRight}>
        <Typography variant="h1" className={styles.title}>
          {deal.title}
        </Typography>
        <Box className={styles.headerMeta}>
          <Typography className={styles.transactionId}>
            <span className={styles.transactionIdLabel}>شناسه معامله:</span>
            <span className={styles.transactionIdValue}>{deal.id}</span>
          </Typography>
          <Box className={`${styles.statusBadge} ${styles[deal.statusType]}`}>
            {deal.status}
          </Box>
          <Box className={styles.roleBadge}>شما {deal.role} هستید</Box>
        </Box>
      </Box>
      <Box className={styles.headerLeft}>
        <Typography className={styles.amount}>
          {deal.amount} {deal.currency || "تومان"}
        </Typography>
        <Typography className={styles.amountLabel}>مبلغ امانی</Typography>
      </Box>
    </Box>
  )
}
