import { Box, Button, CircularProgress, Typography } from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"
import FolderZipIcon from "@mui/icons-material/FolderZip"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import type { Deal } from "@/constants/deals"
import type { UploadedDealDocument } from "@/hooks/documents/useDealDocuments"
import styles from "./styles/TransactionDetail.module.scss"

interface TransactionDocumentsTabProps {
  deal: Deal
  apiDealId: number | null
  apiDocuments: UploadedDealDocument[]
  isDocumentsLoading: boolean
}

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

const getDocumentType = (document: UploadedDealDocument) =>
  document.file_type ||
  document.file_name.split(".").pop()?.toUpperCase() ||
  "—"

const getDocumentIcon = (type: string) => {
  if (type.toUpperCase() === "PDF") {
    return <PictureAsPdfIcon className={styles.documentIcon} />
  }
  if (type.toUpperCase() === "ZIP") {
    return <FolderZipIcon className={styles.documentIcon} />
  }
  return <InsertDriveFileIcon className={styles.documentIcon} />
}

function EmptyDocuments() {
  return <Typography className={styles.emptyState}>اسنادی وجود ندارد</Typography>
}

function ApiDocumentsList({ documents }: { documents: UploadedDealDocument[] }) {
  if (documents.length === 0) return <EmptyDocuments />

  return (
    <Box className={styles.documentsList}>
      {documents.map((document) => {
        const type = getDocumentType(document)
        const uploadedAt = new Date(document.created_at)
        const uploadDate = Number.isNaN(uploadedAt.getTime())
          ? "—"
          : uploadedAt.toLocaleDateString("fa-IR")

        return (
          <Box key={document.id} className={styles.documentItem}>
            <Box className={styles.documentInfo}>
              {getDocumentIcon(type)}
              <Box className={styles.documentDetails}>
                <Typography className={styles.documentName}>
                  {document.document_name}
                </Typography>
                <Box className={styles.documentMeta}>
                  <Typography className={styles.documentType}>
                    {type}
                  </Typography>
                  <Typography className={styles.documentSize}>
                    {formatFileSize(document.file_size)}
                  </Typography>
                  <Typography className={styles.documentDate}>
                    {uploadDate}
                  </Typography>
                </Box>
                <Typography className={styles.documentUploader}>
                  آپلود شده توسط: {document.uploader}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              className={styles.downloadButton}
              startIcon={<DownloadIcon />}
              component="a"
              href={document.download_url}
              target="_blank"
              rel="noreferrer"
            >
              دانلود
            </Button>
          </Box>
        )
      })}
    </Box>
  )
}

function StaticDocumentsList({ deal }: { deal: Deal }) {
  if (!deal.documents || deal.documents.length === 0) return <EmptyDocuments />

  return (
    <Box className={styles.documentsList}>
      {deal.documents.map((doc) => (
        <Box key={doc.id} className={styles.documentItem}>
          <Box className={styles.documentInfo}>
            {getDocumentIcon(doc.type)}
            <Box className={styles.documentDetails}>
              <Typography className={styles.documentName}>{doc.name}</Typography>
              <Box className={styles.documentMeta}>
                <Typography className={styles.documentType}>
                  {doc.type}
                </Typography>
                <Typography className={styles.documentSize}>
                  {doc.size}
                </Typography>
                <Typography className={styles.documentDate}>
                  {doc.uploadDate}
                </Typography>
              </Box>
              <Typography className={styles.documentUploader}>
                آپلود شده توسط: {doc.uploadedBy}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            className={styles.downloadButton}
            startIcon={<DownloadIcon />}
          >
            دانلود
          </Button>
        </Box>
      ))}
    </Box>
  )
}

export default function TransactionDocumentsTab({
  deal,
  apiDealId,
  apiDocuments,
  isDocumentsLoading,
}: TransactionDocumentsTabProps) {
  return (
    <Box className={styles.documentsContainer}>
      {isDocumentsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "24px" }}>
          <CircularProgress size={24} />
        </Box>
      ) : apiDealId ? (
        <ApiDocumentsList documents={apiDocuments} />
      ) : (
        <StaticDocumentsList deal={deal} />
      )}
    </Box>
  )
}
