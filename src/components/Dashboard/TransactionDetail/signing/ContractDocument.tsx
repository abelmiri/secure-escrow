import { useEffect, useState } from "react"
import DownloadOutlined from "@mui/icons-material/DownloadOutlined"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material"
import API_URLS from "@/constants/urls/API_URLS"
import {
  signatureErrorMessage,
  signatureFetch,
} from "@/hooks/deals/contractSignatureApi"

export default function ContractDocument({
  id,
  signed = false,
}: {
  id: string
  signed?: boolean
}) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    let objectUrl = ""
    let active = true
    const timeout = setTimeout(() => controller.abort(), 30000)
    void signatureFetch(API_URLS.documentDownload({ id }), controller.signal)
      .then((response) => response.blob())
      .then((blob) => {
        if (!active) return
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch((error) => {
        if (active) setError(signatureErrorMessage(error))
      })
      .finally(() => clearTimeout(timeout))
    return () => {
      active = false
      clearTimeout(timeout)
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [id, attempt])
  if (error)
    return (
      <Alert
        severity="error"
        action={
          <Button
            onClick={() => {
              setUrl("")
              setError("")
              setAttempt((value) => value + 1)
            }}
          >
            تلاش مجدد
          </Button>
        }
      >
        {error}
      </Alert>
    )
  if (!url) return <CircularProgress size={24} aria-label="دریافت قرارداد" />
  return (
    <Stack
      spacing={1.5}
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography component="h3" variant="subtitle1" fontWeight={700}>
          {signed ? "قرارداد امضاشده" : "متن قرارداد"}
        </Typography>
        <Button
          component="a"
          variant="outlined"
          size="small"
          href={url}
          download={signed ? "signed-contract.pdf" : "contract.pdf"}
          sx={{ gap: 0.75 }}
        >
          <DownloadOutlined fontSize="small" />
          دانلود قرارداد
        </Button>
      </Stack>
      <Box
        component="iframe"
        src={url}
        title={signed ? "قرارداد امضاشده" : "متن قرارداد"}
        sx={{
          width: "100%",
          height: { xs: 260, sm: "clamp(300px, 42vh, 440px)" },
          border: 1,
          borderColor: "divider",
          borderRadius: 1.5,
        }}
      />
    </Stack>
  )
}
