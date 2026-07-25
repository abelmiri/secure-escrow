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
import { useWorkflowActionDetails } from "@/hooks/deals/useWorkflowActionDetails"
import WorkflowActionForm from "./WorkflowActionForm"
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
  dealId?: number
  actions?: NextAvailableAction[]
  isSubmitting?: boolean
  creatorRole?: string
  onActionClick: (action: NextAvailableAction, formData?: Record<string, unknown>, files?: Record<string, File[]>) => Promise<void>
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

const SupportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_969_132)">
      <path d="M14.6667 11.3333C14.6667 11.687 14.5262 12.0261 14.2762 12.2761C14.0261 12.5262 13.687 12.6667 13.3334 12.6667H4.55204C4.19845 12.6667 3.85936 12.8073 3.60937 13.0573L2.14137 14.5253C2.07518 14.5915 1.99084 14.6366 1.89903 14.6548C1.80722 14.6731 1.71206 14.6637 1.62558 14.6279C1.5391 14.5921 1.46518 14.5314 1.41316 14.4536C1.36115 14.3758 1.33339 14.2843 1.33337 14.1907V3.33333C1.33337 2.97971 1.47385 2.64057 1.7239 2.39052C1.97395 2.14048 2.31309 2 2.66671 2H13.3334C13.687 2 14.0261 2.14048 14.2762 2.39052C14.5262 2.64057 14.6667 2.97971 14.6667 3.33333V11.3333Z" stroke="#0A0A0A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_969_132">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

export default function RequiredAction({
  dealId,
  actions = [],
  isSubmitting = false,
  creatorRole,
  onActionClick,
}: RequiredActionProps) {
  const [selectedAction, setSelectedAction] = useState<NextAvailableAction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const { actionDetails, isLoading: isLoadingActionDetails } = useWorkflowActionDetails(
    dealId || null,
    selectedAction?.transition_id || null,
  )

  const handleActionClick = (action: NextAvailableAction) => {
    setSelectedAction(action)
    
    // If it's a form action, open the form dialog
    if (action.action === "form") {
      setIsFormDialogOpen(true)
    } else {
      // Otherwise, open the confirmation dialog
      setIsDialogOpen(true)
    }
  }

  const handleConfirm = async () => {
    if (selectedAction) {
      await onActionClick(selectedAction)
      setIsDialogOpen(false)
      setSelectedAction(null)
    }
  }

  const handleFormSubmit = async (formData: Record<string, unknown>, files: Record<string, File[]>) => {
    if (selectedAction) {
      await onActionClick(selectedAction, formData, files)
      setIsFormDialogOpen(false)
      setSelectedAction(null)
    }
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setIsFormDialogOpen(false)
    setSelectedAction(null)
  }

  return (
    <>
      <Box className={styles.sectionCard}>
        <Typography variant="h3" className={styles.sectionTitle}>
          اقدام مورد نیاز
        </Typography>
        
        {!actions || actions.length === 0 ? (
          // Empty State
          <Box className={styles.emptyStateContent}>
            <Box className={styles.emptyStateMessage}>
              <AccessTimeOutlinedIcon className={styles.emptyStateIcon} />
              <Typography className={styles.emptyStateText}>
                فعلا هیچ اقدامی از سمت شما لازم نیست.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<SupportIcon />}
              className={styles.supportButton}
              sx={{
                width: "100%",
                color: "#667085",
                borderColor: "#d1d5db",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "14px",
                padding: "10px 16px",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#b1b5bb",
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              تماس با پشتیبانی
            </Button>
          </Box>
        ) : (
          // Actions State
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
        )}
      </Box>

      {/* Simple Confirmation Dialog */}
      {selectedAction && selectedAction.action !== "form" && (
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

      {/* Form-based Action Dialog */}
      {selectedAction && selectedAction.action === "form" && (
        <WorkflowActionForm
          open={isFormDialogOpen}
          actionDetails={actionDetails || null}
          isLoading={isLoadingActionDetails}
          isSubmitting={isSubmitting}
          onClose={handleCancel}
          onSubmit={handleFormSubmit}
        />
      )}
    </>
  )
}
