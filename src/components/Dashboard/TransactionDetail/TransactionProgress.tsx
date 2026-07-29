import { Box, Typography } from "@mui/material"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import type { Deal, ProgressStep } from "@/constants/deals"
import CustomCheckIcon from "./CustomCheckIcon"
import styles from "./styles/TransactionDetail.module.scss"

const getProgressStatusLabel = (status?: ProgressStep["status"]) => {
  if (status === "in_progress") return "در حال انجام"
  if (status === "completed") return "تکمیل شده"
  return "در انتظار"
}

const getProgressIcon = (step: ProgressStep) => {
  if (step.status === "completed" || step.icon === "check") {
    return <CustomCheckIcon className={styles.progressIconCompleted} />
  }
  if (step.status === "in_progress" || step.icon === "clock") {
    return <AccessTimeOutlinedIcon className={styles.progressIconInProgress} />
  }
  return <RadioButtonUncheckedIcon className={styles.progressIconPending} />
}

export default function TransactionProgress({
  progress,
}: {
  progress: Deal["progress"]
}) {
  return (
    <Box className={styles.sectionCard}>
      <Typography variant="h3" className={styles.sectionTitle}>
        پیشرفت قرارداد
      </Typography>
      <Box className={styles.progressList}>
        {progress.map((step, index) => (
          <Box key={index} className={styles.progressItem}>
            <Box className={styles.progressIconWrapper}>
              {getProgressIcon(step)}
            </Box>
            <Box className={styles.progressContent}>
              <Box className={styles.progressInfo}>
                <Typography className={styles.progressTitle}>
                  {step.title}
                </Typography>
                <Typography className={styles.progressDescription}>
                  {step.description}
                </Typography>
              </Box>
              {step.date && (
                <Typography className={styles.progressDate}>
                  <div>{step.date}</div>
                  <div>{step.time}</div>
                </Typography>
              )}
              {!step.date && (
                <Typography className={styles.progressStatus}>
                  {getProgressStatusLabel(step.status)}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
