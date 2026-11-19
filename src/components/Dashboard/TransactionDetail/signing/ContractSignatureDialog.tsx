"use client"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import useSWR from "swr"
import { useContractSignature } from "@/hooks/deals/useContractSignature"
import {
  certificateRequest,
  getSigningDocument,
  isFinished,
  isReconciling,
  normalizeSignatureDigits,
  signatureErrorMessage,
  validateSignature,
  type RokhSigningStatus,
} from "@/hooks/deals/contractSignatureApi"
import CertificateEnrollment from "./CertificateEnrollment"
import SignatureInput from "./SignatureInput"
import ContractDocument from "./ContractDocument"

const labels: Record<string, string> = {
  PENDING: "در انتظار امضا",
  PROCESSING: "در حال پردازش",
  COMPLETED: "امضای قرارداد تکمیل شد",
  REFUSED: "امضا رد شده است",
  EXPIRED: "مهلت امضا تمام شده است",
  SIGNED: "امضا شده",
  FAILED: "امضا ناموفق بود",
  UNKNOWN: "نتیجه در حال بررسی است",
}
export default function ContractSignatureDialog({
  dealId,
  identity,
  onClose,
  onDealRefresh,
}: {
  dealId: number
  identity: string
  onClose: () => void
  onDealRefresh: () => Promise<unknown>
}) {
  const { snapshot, busy, uncertain, error, fields, run } =
    useContractSignature(dealId, identity, onDealRefresh)
  const [pin, setPin] = useState("")
  const [otp, setOtp] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [inputVersion, setInputVersion] = useState(0)
  const [otpUntil, setOtpUntil] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [localError, setLocalError] = useState("")
  const [confirmDecline, setConfirmDecline] = useState(false)
  const submitting = useRef(false)
  const mounted = useRef(true)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const signingDocument = snapshot && getSigningDocument(snapshot)
  const reconciling = !!snapshot && isReconciling(snapshot)
  const displayStatus =
    snapshot?.status === "PROCESSING" && !reconciling
      ? "PENDING"
      : snapshot?.status
  const canSign =
    !!snapshot?.can_sign &&
    !uncertain &&
    !busy &&
    !isFinished(snapshot) &&
    !reconciling
  const checkCertificate =
    !!snapshot?.can_sign && !isFinished(snapshot) && !uncertain && !reconciling
  const certificate = useSWR(
    checkCertificate ? ["rokh-signing-status", dealId, identity] : null,
    () =>
      certificateRequest<RokhSigningStatus>(
        dealId,
        "status",
        AbortSignal.timeout(55000),
      ),
    { refreshInterval: 20000, shouldRetryOnError: false },
  )
  const signingState = certificate.data?.signing_state
  const ready =
    !certificate.error &&
    signingState === "READY" &&
    certificate.data?.can_request_document_otp === true
  const needsEnrollment =
    signingState != null &&
    [
      "NEEDS_CERTIFICATE",
      "NEEDS_PIN_SETUP",
      "ENROLLMENT_FAILED",
      "ENROLLMENT_PENDING",
    ].includes(signingState)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  useEffect(() => {
    const tick = () =>
      setSeconds(Math.max(0, Math.ceil((otpUntil - Date.now()) / 1000)))
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [otpUntil])
  useEffect(() => {
    if (snapshot && (!snapshot.can_sign || isFinished(snapshot))) {
      setPin("")
      setOtp("")
      setFile(null)
      setInputVersion((value) => value + 1)
    }
  }, [snapshot])
  const sendOtp = async () => {
    setLocalError("")
    const result = await run("otp")
    if (result?.otp?.sent) {
      setOtpUntil(Date.now() + result.otp.expires_in_seconds * 1000)
      setOtp("")
    }
  }
  const submit = async () => {
    if (!canSign || !ready || submitting.current) return
    submitting.current = true
    try {
      setLocalError("")
      if (!/^\d{6}$/.test(pin)) {
        setLocalError("رمز امضا باید دقیقاً شش رقم باشد.")
        return
      }
      if (!otp.trim() || !file) {
        setLocalError("کد پیامکی و تصویر امضا الزامی هستند.")
        return
      }
      const invalid = await validateSignature(file)
      if (!mounted.current) return
      if (invalid) {
        setLocalError(invalid)
        return
      }
      const data = new FormData()
      data.append("pin", pin)
      data.append("otp", otp.trim())
      data.append("signature", file)
      setPin("")
      setOtp("")
      setOtpUntil(0)
      await run("sign", data)
    } finally {
      submitting.current = false
    }
  }
  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      onClose={onClose}
    >
      <DialogTitle>امضای دیجیتال قرارداد</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {busy && (
            <CircularProgress size={24} aria-label="در حال دریافت نتیجه" />
          )}
          {(error || localError) && (
            <Alert severity="error">{localError || error}</Alert>
          )}
          {error && (
            <Typography component="a" href="/profile" color="primary">
              در صورت نقص کد ملی یا شمارهٔ همراه، پروفایل خود را تکمیل کنید.
            </Typography>
          )}
          {(uncertain || reconciling) && (
            <Alert severity="info">
              نتیجهٔ درخواست هنوز قطعی نیست. تا پایان بررسی، درخواست امضا را
              دوباره ارسال نکنید.
            </Alert>
          )}
          {snapshot && (
            <>
              <Alert
                severity={snapshot.status === "COMPLETED" ? "success" : "info"}
              >
                {displayStatus && labels[displayStatus]}
              </Alert>
              {snapshot.expires_at && (
                <Typography>
                  مهلت امضا:{" "}
                  {new Date(snapshot.expires_at).toLocaleString("fa-IR")}
                </Typography>
              )}
              {snapshot.signers.map((signer) => (
                <Typography key={signer.role}>
                  {signer.role === "customer" ? "خریدار" : "فروشنده"}
                  {signer.is_you ? " (شما)" : ""}:{" "}
                  {labels[signer.status] || signer.status}
                </Typography>
              ))}
              {!snapshot.can_sign && !isFinished(snapshot) && (
                <Typography>
                  در انتظار نوبت امضا یا تکمیل پردازش؛ وضعیت به‌صورت خودکار
                  بررسی می‌شود.
                </Typography>
              )}
              {signingDocument?.id && (
                <ContractDocument
                  key={signingDocument.id}
                  id={signingDocument.id}
                  signed={signingDocument.signed}
                />
              )}
              {snapshot.can_sign && !isFinished(snapshot) && (
                <Stack spacing={2}>
                  {checkCertificate && certificate.isLoading && (
                    <CircularProgress
                      size={24}
                      aria-label="در حال بررسی گواهی رخ"
                    />
                  )}
                  {checkCertificate && certificate.error && (
                    <Alert
                      severity="error"
                      action={
                        <Button
                          onClick={() =>
                            void certificate.mutate().catch(() => {})
                          }
                        >
                          تلاش مجدد
                        </Button>
                      }
                    >
                      {signatureErrorMessage(certificate.error)}
                    </Alert>
                  )}
                  {checkCertificate && needsEnrollment && (
                    <CertificateEnrollment
                      dealId={dealId}
                      identity={identity}
                      signingState={signingState}
                      refreshStatus={certificate.mutate}
                    />
                  )}
                  {checkCertificate &&
                    certificate.data &&
                    !ready &&
                    !needsEnrollment && (
                      <Alert severity="warning">
                        {signingState === "REVOKE_REQUIRED"
                          ? "ابتدا باید گواهی قبلی خود را در رخ باطل کنید."
                          : "حساب شما در رخ هنوز آمادهٔ امضای سند نیست."}
                      </Alert>
                    )}
                  {ready && (
                    <>
                      <SignatureInput
                        key={inputVersion}
                        onChange={setFile}
                        disabled={!canSign}
                      />
                      {fields.signature && (
                        <Alert severity="error">{fields.signature}</Alert>
                      )}
                      <TextField
                        label="رمز شش‌رقمی امضا (PIN)"
                        type="password"
                        value={pin}
                        autoComplete="off"
                        disabled={!canSign}
                        onChange={(event) =>
                          setPin(normalizeSignatureDigits(event.target.value))
                        }
                        error={!!fields.pin}
                        helperText={fields.pin}
                        slotProps={{
                          htmlInput: { inputMode: "numeric", maxLength: 6 },
                        }}
                      />
                      <Button
                        disabled={!canSign || seconds > 0}
                        onClick={() => void sendOtp()}
                      >
                        {" "}
                        {seconds > 0
                          ? `ارسال مجدد پس از ${seconds} ثانیه`
                          : "دریافت کد پیامکی"}
                      </Button>
                      {seconds > 0 && (
                        <Typography>
                          کد پیامکی ارسال شد؛ اعتبار باقی‌مانده: {seconds} ثانیه
                        </Typography>
                      )}
                      <TextField
                        label="کد پیامکی"
                        value={otp}
                        autoComplete="off"
                        disabled={!canSign}
                        onChange={(event) =>
                          setOtp(normalizeSignatureDigits(event.target.value))
                        }
                        error={!!fields.otp}
                        helperText={fields.otp}
                        slotProps={{
                          htmlInput: { inputMode: "numeric", maxLength: 32 },
                        }}
                      />
                      <Button
                        variant="contained"
                        disabled={!canSign}
                        onClick={() => void submit()}
                      >
                        ثبت امضای قرارداد
                      </Button>
                    </>
                  )}
                  <Button
                    color="error"
                    disabled={!canSign}
                    onClick={() => setConfirmDecline(true)}
                  >
                    رد امضای قرارداد
                  </Button>
                </Stack>
              )}
            </>
          )}
          <Button disabled={busy} onClick={() => void run("refresh")}>
            بررسی مجدد وضعیت
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>بستن</Button>
      </DialogActions>
      <Dialog open={confirmDecline} onClose={() => setConfirmDecline(false)}>
        <DialogTitle>رد امضای قرارداد؟</DialogTitle>
        <DialogContent>
          با رد امضا، معامله در مرحلهٔ امضا باقی می‌ماند و وجهی جابه‌جا نمی‌شود.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDecline(false)}>انصراف</Button>
          <Button
            color="error"
            disabled={!canSign}
            onClick={async () => {
              setConfirmDecline(false)
              await run("decline")
            }}
          >
            تأیید رد امضا
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}
