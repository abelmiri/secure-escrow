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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControlLabel,
} from "@mui/material"
import type { SelectChangeEvent } from "@mui/material/Select"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined"
import type {
  WorkflowActionDetails,
  WorkflowField,
  WorkflowRequiredDocument,
} from "@/hooks/deals/useWorkflowActionDetails"
import styles from "./styles/RequiredAction.module.scss"

export interface NextAvailableAction {
  transition_id: number
  action: string
  action_color?: "success" | "warning" | "error" | "info"
  action_text?: string
  destination_step: number
  destination_step_name: string
  inputs?: {
    fields?: WorkflowActionDetails["fields"] | null
    required_documents?: Array<
      WorkflowRequiredDocument | WorkflowRequiredDocument[]
    > | null
  } | null
}

interface RequiredActionProps {
  dealId?: number
  actions?: NextAvailableAction[]
  isSubmitting?: boolean
  creatorRole?: string
  actorDescription?: string | null
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

const getActionDetailsFromAction = (
  action: NextAvailableAction | null,
): WorkflowActionDetails | null => {
  if (!action || action.action !== "form") return null

  const requiredDocuments = (action.inputs?.required_documents || []).flat()

  return {
    transition: {
      transition_id: action.transition_id,
      from_step: 0,
      from_step_name: "",
      to_step: action.destination_step,
      to_step_name: action.destination_step_name,
      actor_role: "",
    },
    action: action.action,
    action_label: action.action_text || action.action,
    fields: action.inputs?.fields || [],
    required_documents: requiredDocuments,
  }
}

const getDocumentUploadKey = (document: WorkflowRequiredDocument) =>
  document.document_requirement_code || document.document_type_code

const isEmptyFieldValue = (value: unknown) => {
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "boolean") return false
  return value === undefined || value === null || String(value).trim() === ""
}

const getFieldOptions = (field: WorkflowField) =>
  field.options?.map((option) =>
    typeof option === "string"
      ? { label: option, value: option }
      : { label: option.label, value: option.value },
  ) || []

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
  actions = [],
  isSubmitting = false,
  creatorRole,
  actorDescription,
  onActionClick,
}: RequiredActionProps) {
  const [selectedAction, setSelectedAction] = useState<NextAvailableAction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({})
  const formAction =
    actions.find((action) => action.action.toLowerCase() === "form") || null
  const actionDetails = getActionDetailsFromAction(formAction)

  const handleFieldChange = (fieldSlug: string, value: unknown) => {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[fieldSlug]
      return next
    })
    setFormData((prev) => ({ ...prev, [fieldSlug]: value }))
  }

  const handleFileSelect = (
    uploadKey: string,
    document: WorkflowRequiredDocument,
    selectedFiles: FileList | null,
  ) => {
    if (!selectedFiles) return

    const files = Array.from(selectedFiles)
    const nextErrors: Record<string, string> = {}

    if (files.length < document.files_min || files.length > document.files_max) {
      nextErrors[uploadKey] =
        `تعداد فایل باید بین ${document.files_min} تا ${document.files_max} باشد`
    }

    files.forEach((file) => {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      if (!document.allowed_file_types.includes(fileExtension)) {
        nextErrors[uploadKey] =
          `نوع فایل ${fileExtension} مجاز نیست. فایل‌های مجاز: ${document.allowed_file_types.join(", ")}`
      }

      if (file.size > document.maximum_size_bytes) {
        nextErrors[uploadKey] =
          `اندازه فایل بیش از حد مجاز است. حد مجاز: ${(document.maximum_size_bytes / 1024 / 1024).toFixed(2)} MB`
      }
    })

    if (Object.keys(nextErrors).length > 0) {
      setFileErrors((prev) => ({ ...prev, ...nextErrors }))
      return
    }

    setFileErrors((prev) => {
      const next = { ...prev }
      delete next[uploadKey]
      return next
    })
    setUploadedFiles((prev) => ({ ...prev, [uploadKey]: files }))
  }

  const handleActionClick = (action: NextAvailableAction) => {
    if (action.action.toLowerCase() === "edit") {
      void onActionClick(action)
      return
    }

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

  const handleFormSubmit = async () => {
    if (!formAction || !actionDetails) return

    const nextFieldErrors: Record<string, string> = {}
    const nextFileErrors: Record<string, string> = {}
    const submittedFormData = actionDetails.fields.reduce<
      Record<string, unknown>
    >((fields, field) => {
      fields[field.slug] = formData[field.slug] ?? field.default_value ?? ""
      return fields
    }, {})

    actionDetails.fields.forEach((field) => {
      if (field.required && isEmptyFieldValue(submittedFormData[field.slug])) {
        nextFieldErrors[field.slug] = "این فیلد الزامی است."
      }
    })

    actionDetails.required_documents.forEach((document) => {
      const uploadKey = getDocumentUploadKey(document)
      const uploadedCount = uploadedFiles[uploadKey]?.length || 0

      if (
        document.requirement_type === "required" &&
        uploadedCount < document.files_min
      ) {
        nextFileErrors[uploadKey] = `حداقل ${document.files_min} فایل بارگذاری کنید.`
      }
    })

    if (
      Object.keys(nextFieldErrors).length > 0 ||
      Object.keys(nextFileErrors).length > 0
    ) {
      setFieldErrors(nextFieldErrors)
      setFileErrors((prev) => ({ ...prev, ...nextFileErrors }))
      return
    }

    await onActionClick(formAction, submittedFormData, uploadedFiles)
    setFormData({})
    setUploadedFiles({})
    setFieldErrors({})
    setFileErrors({})
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedAction(null)
  }

  const renderFormField = (field: WorkflowField) => {
    const value = formData[field.slug] ?? field.default_value ?? ""
    const error = fieldErrors[field.slug]
    const commonTextFieldProps = {
      fullWidth: true,
      label: field.label,
      required: field.required,
      error: Boolean(error),
      helperText: error,
      className: styles.formField,
      size: "small" as const,
    }

    if (field.field_type === "date") {
      return (
        <TextField
          key={field.slug}
          type="date"
          value={value}
          onChange={(event) => handleFieldChange(field.slug, event.target.value)}
          InputLabelProps={{ shrink: true }}
          {...commonTextFieldProps}
        />
      )
    }

    if (field.field_type === "number" || field.field_type === "integer") {
      return (
        <TextField
          key={field.slug}
          type="number"
          value={value}
          onChange={(event) => handleFieldChange(field.slug, event.target.value)}
          {...commonTextFieldProps}
        />
      )
    }

    if (field.field_type === "checkbox" || field.field_type === "bool") {
      return (
        <Box key={field.slug} className={styles.checkboxField}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(event) =>
                  handleFieldChange(field.slug, event.target.checked)
                }
              />
            }
            label={field.label}
          />
          {error && <Typography className={styles.fieldError}>{error}</Typography>}
        </Box>
      )
    }

    if (
      field.field_type === "select" ||
      field.field_type === "dropdown" ||
      field.field_type === "radio"
    ) {
      return (
        <FormControl
          key={field.slug}
          fullWidth
          size="small"
          className={styles.formField}
          error={Boolean(error)}
        >
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value}
            label={field.label}
            onChange={(event) =>
              handleFieldChange(field.slug, event.target.value)
            }
          >
            {getFieldOptions(field).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <Typography className={styles.fieldError}>{error}</Typography>}
        </FormControl>
      )
    }

    if (field.field_type === "multiselect") {
      const selectedValues = Array.isArray(value) ? (value as string[]) : []

      return (
        <FormControl
          key={field.slug}
          fullWidth
          size="small"
          className={styles.formField}
          error={Boolean(error)}
        >
          <InputLabel>{field.label}</InputLabel>
          <Select<string[]>
            multiple
            value={selectedValues}
            label={field.label}
            onChange={(event: SelectChangeEvent<string[]>) => {
              const selected = event.target.value
              handleFieldChange(
                field.slug,
                typeof selected === "string" ? selected.split(",") : selected,
              )
            }}
            renderValue={(selected) =>
              getFieldOptions(field)
                .filter((option) => selected.includes(option.value))
                .map((option) => option.label)
                .join("، ")
            }
          >
            {getFieldOptions(field).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={selectedValues.includes(option.value)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
          {error && <Typography className={styles.fieldError}>{error}</Typography>}
        </FormControl>
      )
    }

    return (
      <TextField
        key={field.slug}
        value={value}
        onChange={(event) => handleFieldChange(field.slug, event.target.value)}
        multiline={field.field_type === "text"}
        rows={field.field_type === "text" ? 3 : undefined}
        {...commonTextFieldProps}
      />
    )
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
                {actorDescription ||
                (creatorRole
                  ? `معامله توسط ${roleLabels[creatorRole] || creatorRole} ایجاد شده است`
                  : "برای ادامه معامله، یکی از اقدامات زیر را انتخاب کنید.")}
              </Typography>
            </Box>
            {actionDetails && (
              <Box className={styles.inlineForm}>
                {actionDetails.required_documents.map((document) => {
                  const uploadKey = getDocumentUploadKey(document)
                  const files = uploadedFiles[uploadKey] || []

                  return (
                    <Box key={uploadKey} className={styles.uploadField}>
                      <input
                        id={`workflow-upload-${uploadKey}`}
                        type="file"
                        multiple={document.files_max > 1}
                        accept={document.allowed_file_types.join(",")}
                        onChange={(event) =>
                          handleFileSelect(uploadKey, document, event.target.files)
                        }
                        className={styles.hiddenFileInput}
                      />
                      <label
                        htmlFor={`workflow-upload-${uploadKey}`}
                        className={styles.uploadBox}
                      >
                        <CloudUploadOutlinedIcon className={styles.uploadIcon} />
                        <Typography className={styles.uploadTitle}>
                          بارگذاری {document.title}
                        </Typography>
                        <Typography className={styles.uploadDescription}>
                          فایل‌ها را اینجا بکشید یا کلیک کنید
                        </Typography>
                        <Button
                          component="span"
                          variant="outlined"
                          className={styles.uploadButton}
                        >
                          انتخاب فایل
                        </Button>
                        <Typography className={styles.uploadHint}>
                          حداقل {document.files_min} و حداکثر{" "}
                          {document.files_max} فایل
                        </Typography>
                      </label>
                      {files.length > 0 && (
                        <Box className={styles.selectedFiles}>
                          {files.map((file) => (
                            <Typography
                              key={`${uploadKey}-${file.name}`}
                              className={styles.selectedFile}
                            >
                              {file.name}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {fileErrors[uploadKey] && (
                        <Typography className={styles.fieldError}>
                          {fileErrors[uploadKey]}
                        </Typography>
                      )}
                    </Box>
                  )
                })}

                {actionDetails.fields
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map(renderFormField)}
              </Box>
            )}
            <Box className={styles.actionsButtonsContainer}>
              {actions
                .filter((action) => action.action.toLowerCase() !== "form")
                .map((action) => {
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
              {formAction && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className={styles.submitFormButton}
                >
                  {isSubmitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    formAction.action_text || "ثبت اقدام"
                  )}
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<SupportIcon />}
                className={styles.supportButton}
                sx={{
                  width: "100%",
                  color: "#101828",
                  borderColor: "#e4e7ec",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#d0d5dd",
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                تماس با پشتیبانی
              </Button>
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

    </>
  )
}
