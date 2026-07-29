import { Box, Typography } from "@mui/material"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import styles from "./styles/TransactionDetail.module.scss"

export default function WorkflowInfoAlert({
  description,
}: {
  description?: string | null
}) {
  if (!description) return null

  return (
    <Box className={styles.infoAlert}>
      <Box className={styles.alertContent}>
        <InfoOutlinedIcon className={styles.alertIcon} />
        <Typography className={styles.alertText}>{description}</Typography>
      </Box>
    </Box>
  )
}
