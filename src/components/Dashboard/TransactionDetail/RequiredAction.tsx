"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import styles from "./styles/RequiredAction.module.scss"

export interface NextAvailableAction {
  transition_id: number
  action: string
  action_color?: "success" | "warning" | "error" | "info"
  action_text?: string
  destination_step: number
  destination_step_name: string
}

interface RequiredActionProps {
  actions?: NextAvailableAction[]
  isSubmitting?: boolean
  creatorRole?: string
  onActionClick: (action: NextAvailableAction) => void
}

const actionColorMap: Record<string, { variant: "contained" | "outlined"; color: "success" | "error" | "warning" | "info"; bg: string; text: string; border: string }> = {
  success: { variant: "contained", color: "success", bg: "#10b981", text: "#ffffff", border: "#10b981" },
  warning: { variant: "contained", color: "warning", bg: "#f59e0b", text: "#ffffff", border: "#f59e0b" },
  error: { variant: "outlined", color: "error", bg: "#ffffff", text: "#ef4444", border: "#ef4444" },
  info: { variant: "contained", color: "info", bg: "#3b82f6", text: "#ffffff", border: "#3b82f6" },
}

const roleLabels: Record<string, string> = {
  customer: "خریدار",
  beneficiary: "فروشنده",
  broker: "کارگزار",
}

export default function RequiredAction({
  actions = [],
  isSubmitting = false,
  creatorRole,
  onActionClick,
}: RequiredActionProps) {
  const [selectedAction, setSelectedAction] = useState<NextAvailableAction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (!actions || actions.length === 0) {
    return null
  }

  const handleActionClick = (action: NextAvailableAction) => {
    setSelectedAction(action)
    setIsDialogOpen(true)
  }

  const handleConfirm = async () => {
    if (selectedAction) {
      await onActionClick(selectedAction)
      setIsDialogOpen(false)
      setSelectedAction(null)
    }
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedAction(null)
  }

  return (
    <>
      <Box className={styles.sectionCard}>
        <Typography variant="h3" className={styles.sectionTitle}>
          اقدام مورد نیاز
        </Typography>
        <Box className={styles.actionContent}>
          <Box className={styles.actionText}>
            <AccessTimeOutlinedIcon className={styles.actionIcon} />
            <Typography className={styles.actionMessage}>
              {creatorRole
                ? `معامله توسط ${roleLabels[creatorRole] || creatorRole} ایجاد شده است`
                : "برای ادامه معامله، یکی از اقدامات زیر را انتخاب کنید."}
            </Typography>
          </Box>
          <Box className={styles.actionsButtonsContainer}>
            {actions.map((action) => {
              const color = (action.action_color || "info") as "success" | "warning" | "error" | "info"
              const colorStyle = actionColorMap[color]
              return (
                <Button
                  key={action.transition_id}
                  variant="contained"
                  fullWidth
                  onClick={() => handleActionClick(action)}
                  disabled={isSubmitting}
                  sx={{
                    background: colorStyle.bg,
                    color: colorStyle.text,
                    border: `1px solid ${colorStyle.border}`,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: isSubmitting ? "none" : "translateY(-2px)",
                      boxShadow: isSubmitting
                        ? "none"
                        : `0 8px 16px ${colorStyle.border}33`,
                    },
                    "&:disabled": {
                      opacity: 0.6,
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                  ) : null}
                  {action.action_text || action.action}
                </Button>
              )
            })}
          </Box>
        </Box>
      </Box>

      {selectedAction && (
        <Dialog
          open={isDialogOpen}
          onClose={handleCancel}
          slotProps={{
            paper: {
              sx: { direction: "rtl", borderRadius: "16px", width: "100%" },
            },
          }}
        >
          <DialogTitle>تأیید اقدام</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ textAlign: "right", lineHeight: 1.8 }}>
              آیا از {selectedAction.action_text || selectedAction.action} مطمئن هستید؟ پس از تأیید، قرارداد
              وارد مرحله «{selectedAction.destination_step_name}» می‌شود.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: "8px 24px 20px", gap: "8px" }}>
            <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
              انصراف
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
            >
              تأیید و ادامه
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
