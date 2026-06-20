import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined"
import type { DocumentRequirement } from "@/hooks/documents/useDocumentRequirements"
import type { DocumentUpload } from "./types"
import styles from "./styles/TransactionFormDetails.module.scss"

type Props = {
  requirement: DocumentRequirement
  uploads: DocumentUpload[]
  dealId?: number | null
  onFilesSelected: (requirement: DocumentRequirement, files: File[]) => void
  onRetry: (upload: DocumentUpload) => void
}

export default function DocumentRequirementField({
  requirement,
  uploads,
  dealId,
  onFilesSelected,
  onRetry,
}: Props) {
  const requirementKey =
    requirement.document_type_code || requirement.slug || String(requirement.id)
  const requirementName =
    requirement.title || requirement.name || requirementKey
  const isRequired =
    requirement.is_required ?? requirement.requirement_type !== "optional"
  const maxFiles = requirement.files_max || 3
  const minFiles = requirement.files_min || (isRequired ? 1 : 0)
  const canSelectMore = uploads.length < maxFiles
  const accept = requirement.file_types?.length
    ? requirement.file_types
        .map((type) => `.${type.replace(/^\./, "")}`)
        .join(",")
    : undefined

  const selectFiles = (files: File[]) => {
    onFilesSelected(requirement, files)
  }

  return (
    <div className={styles.fullWidth}>
      <div className={styles.radioQuestion}>
        {requirementName}
        {isRequired && " *"}
      </div>

      {(requirement.description || requirement.requirement_type) && (
        <div className={styles.fieldDescription}>
          {requirement.description ||
            (requirement.requirement_type === "conditional"
              ? "این سند در شرایط خاص ضروری است"
              : requirement.requirement_type === "optional"
                ? "این سند اختیاری است"
                : "این سند الزامی است")}
        </div>
      )}

      <div
        className={styles.fileUploadCard}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          selectFiles(Array.from(event.dataTransfer.files))
        }}
      >
        <input
          id={`file-upload-${requirementKey}`}
          type="file"
          multiple
          accept={accept}
          hidden
          disabled={!dealId || !canSelectMore}
          onChange={(event) => {
            selectFiles(
              event.target.files ? Array.from(event.target.files) : [],
            )
            event.target.value = ""
          }}
        />
        <label
          htmlFor={`file-upload-${requirementKey}`}
          className={styles.fileUploadLabel}
        >
          <FileUploadOutlinedIcon className={styles.fileUploadIcon} />
          <div className={styles.fileUploadText}>
            فایل‌ها را اینجا بکشید یا کلیک کنید
          </div>
          <span className={styles.fileUploadButton}>انتخاب فایل</span>
          <span className={styles.fileUploadHint}>
            حداقل {minFiles} و حداکثر {maxFiles} فایل
          </span>
        </label>
      </div>

      {uploads.length > 0 && (
        <div className={styles.selectedFiles}>
          {uploads.map((upload) => (
            <div key={upload.id} className={styles.fileName}>
              <span>{upload.file.name}</span>
              <span className={styles.fileStatus}>
                {upload.status === "uploading" && "در حال بارگذاری..."}
                {upload.status === "uploaded" && "بارگذاری شد"}
                {upload.status === "failed" && (
                  <button
                    type="button"
                    className={styles.retryUpload}
                    onClick={() => onRetry(upload)}
                  >
                    تلاش دوباره
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
