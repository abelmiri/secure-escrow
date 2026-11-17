import { useEffect, useState } from "react"
import { Alert, Box, Button, CircularProgress, Stack } from "@mui/material"
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
    <Stack spacing={1}>
      <Button
        component="a"
        href={url}
        download={signed ? "signed-contract.pdf" : "contract.pdf"}
      >
        دانلود {signed ? "قرارداد امضاشده" : "قرارداد"}
      </Button>
      <Box
        component="iframe"
        src={url}
        title={signed ? "قرارداد امضاشده" : "متن قرارداد"}
        sx={{
          width: "100%",
          height: 350,
          border: "1px solid",
          borderColor: "divider",
        }}
      />
    </Stack>
  )
}
