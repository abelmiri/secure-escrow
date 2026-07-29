"use client"

import { useState } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import type {
  WorkflowActionDetails,
  WorkflowField,
  WorkflowRequiredDocument,
} from "@/hooks/deals/useWorkflowActionDetails"

interface WorkflowActionFormProps {
  open: boolean
  actionDetails: WorkflowActionDetails | null
  isLoading: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (formData: Record<string, unknown>, files: Record<string, File[]>) => Promise<void>
}

const renderFormField = (
  field: WorkflowField,
  value: unknown,
  onChange: (value: unknown) => void,
  error?: string,
) => {
  const commonProps = {
    fullWidth: true,
    label: field.label,
    required: field.required,
    size: "small" as const,
    sx: { mb: 2 },
    error: Boolean(error),
    helperText: error,
  }

  switch (field.field_type) {
    case "date":
      return (
        <TextField
          key={field.id}
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          {...commonProps}
        />
      )

    case "number":
      return (
        <TextField
          key={field.id}
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          {...commonProps}
        />
      )

    case "checkbox":
      return (
        <FormControlLabel
          key={field.id}
          control={
            <Checkbox
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label={field.label}
        />
      )

    case "select":
    case "radio":
      return (
        <FormControl
          key={field.id}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          error={Boolean(error)}
        >
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            label={field.label}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && (
            <Typography variant="caption" sx={{ color: "#ef4444", mt: 0.5 }}>
              {error}
            </Typography>
          )}
        </FormControl>
      )

    case "text":
    default:
      return (
        <TextField
          key={field.id}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          multiline
          rows={3}
          {...commonProps}
        />
      )
  }
}

const getDocumentUploadKey = (document: WorkflowRequiredDocument) =>
  document.document_requirement_code || document.document_type_code

export default function WorkflowActionForm({
  open,
  actionDetails,
  isLoading,
  isSubmitting,
  onClose,
  onSubmit,
}: WorkflowActionFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({})
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[fieldId]
      return next
    })
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleFileSelect = (
    documentTypeCode: string,
    document: WorkflowRequiredDocument,
    selectedFiles: FileList | null,
  ) => {
    if (!selectedFiles) return

    const files = Array.from(selectedFiles)
    const errors: Record<string, string> = {}

    // Validate file count
    if (files.length < document.files_min || files.length > document.files_max) {
      errors[documentTypeCode] = `تعداد فایل باید بین ${document.files_min} تا ${document.files_max} باشد`
    }

    // Validate file types and sizes
    files.forEach((file) => {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      if (!document.allowed_file_types.includes(fileExtension)) {
        errors[documentTypeCode] = `نوع فایل ${fileExtension} مجاز نیست. فایل‌های مجاز: ${document.allowed_file_types.join(", ")}`
      }

      if (file.size > document.maximum_size_bytes) {
        errors[documentTypeCode] = `اندازه فایل بیش از حد مجاز است. حد مجاز: ${(document.maximum_size_bytes / 1024 / 1024).toFixed(2)} MB`
      }
    })

    setFileErrors((prev) => ({
      ...prev,
      ...errors,
    }))

    if (Object.keys(errors).length === 0) {
      setFileErrors((prev) => {
        const next = { ...prev }
        delete next[documentTypeCode]
        return next
      })
      setUploadedFiles((prev) => ({
        ...prev,
        [documentTypeCode]: files,
      }))
    }
  }

  const handleSubmit = async () => {
    const nextFieldErrors: Record<string, string> = {}
    const nextFileErrors: Record<string, string> = {}

    actionDetails?.fields.forEach((field) => {
      const value = formData[field.slug]
      const isEmpty =
        value === undefined || value === null || String(value).trim() === ""

      if (field.required && isEmpty) {
        nextFieldErrors[field.slug] = "این فیلد الزامی است."
      }
    })

    actionDetails?.required_documents.forEach((document) => {
      const uploadKey = getDocumentUploadKey(document)
      const uploadedCount = uploadedFiles[uploadKey]?.length || 0
      const isRequired = document.requirement_type === "required"

      if (isRequired && uploadedCount < document.files_min) {
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

    await onSubmit(formData, uploadedFiles)
    // Reset form
    setFormData({})
    setUploadedFiles({})
    setFileErrors({})
    setFieldErrors({})
  }

  if (!actionDetails) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {actionDetails.action_label || "اقدام فرم‌دار"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            {/* Form Fields */}
            {actionDetails.fields && actionDetails.fields.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  اطلاعات مورد نیاز
                </Typography>
                {actionDetails.fields
                  .sort((a, b) => a.order - b.order)
                  .map((field) =>
                    renderFormField(
                      field,
                      formData[field.slug],
                      (value) => handleFieldChange(field.slug, value),
                      fieldErrors[field.slug],
                    ),
                  )}
              </Box>
            )}

            {/* Required Documents */}
            {actionDetails.required_documents &&
              actionDetails.required_documents.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    اسناد مورد نیاز
                  </Typography>
                  {actionDetails.required_documents.map((document) => (
                    <Box key={getDocumentUploadKey(document)} sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {document.title}
                        {document.requirement_type === "required" && (
                          <span style={{ color: "#ef4444" }}>*</span>
                        )}
                      </Typography>

                      {document.description && (
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mb: 1, color: "#666" }}
                        >
                          {document.description}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          border: "1px dashed #d1d5db",
                          borderRadius: "8px",
                          p: 2,
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#3b82f6",
                            backgroundColor: "#f0f9ff",
                          },
                        }}
                        component="label"
                      >
                        <input
                          type="file"
                          multiple={document.files_max > 1}
                          accept={document.allowed_file_types.join(",")}
                          onChange={(e) =>
                            handleFileSelect(
                              getDocumentUploadKey(document),
                              document,
                              e.target.files,
                            )
                          }
                          style={{ display: "none" }}
                        />
                        <CloudUploadIcon sx={{ fontSize: 24, color: "#3b82f6", mb: 1 }} />
                        <Typography variant="body2" sx={{ color: "#3b82f6" }}>
                          برای بارگذاری فایل اینجا کلیک کنید
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", color: "#999", mt: 0.5 }}>
                          فرمت‌های قابل قبول: {document.allowed_file_types.join(", ")}
                        </Typography>
                      </Box>

                      {uploadedFiles[getDocumentUploadKey(document)] && (
                        <Box sx={{ mt: 1 }}>
                          {uploadedFiles[getDocumentUploadKey(document)].map(
                            (file, idx) => (
                              <Typography
                                key={idx}
                                variant="caption"
                                sx={{
                                  display: "block",
                                  color: "#10b981",
                                  mt: 0.5,
                                }}
                              >
                                ✓ {file.name}
                              </Typography>
                            ),
                          )}
                        </Box>
                      )}

                      {fileErrors[getDocumentUploadKey(document)] && (
                        <Typography
                          variant="caption"
                          sx={{ display: "block", color: "#ef4444", mt: 1 }}
                        >
                          {fileErrors[getDocumentUploadKey(document)]}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSubmitting}
        >
          انصراف
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          ثبت اقدام
        </Button>
      </DialogActions>
    </Dialog>
  )
}
