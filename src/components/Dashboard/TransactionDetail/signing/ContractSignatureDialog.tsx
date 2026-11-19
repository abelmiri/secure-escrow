"use client"
import { useEffect, useId, useRef, useState } from "react"
import CloseRounded from "@mui/icons-material/CloseRounded"
import DrawOutlined from "@mui/icons-material/DrawOutlined"
import RefreshRounded from "@mui/icons-material/RefreshRounded"
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  type ChipProps,
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

const statusColors: Record<string, ChipProps["color"]> = {
  COMPLETED: "success",
  SIGNED: "success",
  FAILED: "error",
  REFUSED: "error",
  EXPIRED: "error",
  PROCESSING: "info",
  UNKNOWN: "warning",
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
  const titleId = useId()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const signingDocument = snapshot && getSigningDocument(snapshot)
  const reconciling = !!snapshot && isReconciling(snapshot)
  const displayStatus =
    snapshot?.status === "PROCESSING" && !reconciling
      ? "PENDING"
      : snapshot?.status
  const showSigningForm = !!snapshot?.can_sign && !isFinished(snapshot)
  const checkCertificate = showSigningForm && !uncertain && !reconciling
  const canSign = checkCertificate && !busy
  const certificate = useSWR(
    checkCertificate ? ["rokh-signing-status", dealId, identity] : null,
    () =>
      certificateRequest<RokhSigningStatus>(
        dealId,
        "status",
        AbortSignal.timeout(55000),
      ),
    {
      refreshInterval: (status) =>
        status?.signing_state === "ENROLLMENT_PENDING" ? 20000 : 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
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
      aria-labelledby={titleId}
      slotProps={{
        paper: {
          sx: { borderRadius: { xs: 0, sm: 3 }, overflow: "hidden" },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "action.hover",
            color: "primary.main",
          }}
        >
          <DrawOutlined fontSize="small" />
        </Box>
        <Typography
          id={titleId}
          component="h2"
          variant="h6"
          sx={{ flex: 1, fontWeight: 700 }}
        >
          امضای دیجیتال قرارداد
        </Typography>
        <IconButton aria-label="بستن" onClick={onClose}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          bgcolor: "grey.50",
        }}
      >
        <Stack spacing={2.5}>
          {busy && !snapshot && (
            <CircularProgress size={24} aria-label="در حال دریافت نتیجه" />
          )}
          {error && !localError && <Alert severity="error">{error}</Alert>}
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
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography
                      component="h3"
                      variant="subtitle2"
                      fontWeight={700}
                    >
                      وضعیت امضا
                    </Typography>
                    {displayStatus && (
                      <Chip
                        size="small"
                        label={labels[displayStatus] || displayStatus}
                        color={statusColors[displayStatus]}
                      />
                    )}
                  </Stack>
                  {snapshot.expires_at && (
                    <Typography variant="caption" color="text.secondary">
                      مهلت امضا:{" "}
                      {new Date(snapshot.expires_at).toLocaleString("fa-IR")}
                    </Typography>
                  )}
                </Stack>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 1,
                  }}
                >
                  {snapshot.signers.map((signer) => (
                    <Stack
                      key={signer.role}
                      direction="row"
                      gap={1}
                      flexWrap="wrap"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ p: 1, borderRadius: 1.5, bgcolor: "grey.50" }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {signer.role === "customer" ? "خریدار" : "فروشنده"}
                        {signer.is_you ? " (شما)" : ""}
                      </Typography>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={labels[signer.status] || signer.status}
                        color={statusColors[signer.status]}
                      />
                    </Stack>
                  ))}
                </Box>
                {!snapshot.can_sign && !isFinished(snapshot) && (
                  <Typography variant="body2" color="text.secondary">
                    در انتظار نوبت امضا یا تکمیل پردازش.
                  </Typography>
                )}
              </Stack>
              {signingDocument?.id && (
                <ContractDocument
                  key={signingDocument.id}
                  id={signingDocument.id}
                  signed={signingDocument.signed}
                />
              )}
              {showSigningForm && (
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
                    <Stack
                      spacing={2}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.paper",
                      }}
                    >
                      <SignatureInput
                        key={inputVersion}
                        onChange={setFile}
                        disabled={!canSign}
                      />
                      {fields.signature && (
                        <Alert severity="error">{fields.signature}</Alert>
                      )}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "minmax(0, 2fr) minmax(0, 3fr)",
                          },
                          gap: 1.5,
                          "& .MuiInputLabel-root": {
                            left: "auto",
                            right: 0,
                            transformOrigin: "top right",
                            transform: "translate(-14px, 16px) scale(1)",
                          },
                          "& .MuiInputLabel-shrink": {
                            transform: "translate(-14px, -9px) scale(0.75)",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            textAlign: "right",
                          },
                        }}
                      >
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
                        <Stack direction="row" alignItems="flex-start" gap={1}>
                          <TextField
                            fullWidth
                            label="کد پیامکی"
                            value={otp}
                            autoComplete="off"
                            disabled={!canSign}
                            onChange={(event) =>
                              setOtp(
                                normalizeSignatureDigits(event.target.value),
                              )
                            }
                            error={!!fields.otp}
                            helperText={fields.otp}
                            slotProps={{
                              htmlInput: {
                                inputMode: "numeric",
                                maxLength: 32,
                              },
                            }}
                          />
                          <Button
                            variant="outlined"
                            disabled={!canSign || seconds > 0}
                            onClick={() => void sendOtp()}
                            sx={{
                              flexShrink: 0,
                              minHeight: 56,
                              px: { xs: 1, sm: 1.5 },
                            }}
                          >
                            {seconds > 0
                              ? `ارسال مجدد پس از ${seconds} ثانیه`
                              : "دریافت کد پیامکی"}
                          </Button>
                        </Stack>
                      </Box>
                      {seconds > 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          role="status"
                        >
                          کد پیامکی ارسال شد.
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Stack>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.5,
          gap: 1,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {showSigningForm && ready && localError && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {localError}
          </Alert>
        )}
        {showSigningForm && ready && (
          <Button
            variant="contained"
            disableElevation
            disabled={!canSign}
            onClick={() => void submit()}
            sx={{ width: { xs: "100%", sm: "auto" }, minHeight: 44, px: 3 }}
          >
            ثبت امضای قرارداد
          </Button>
        )}
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={0.5}
          sx={{ marginInlineStart: "auto" }}
        >
          <Button
            disabled={busy}
            sx={{ gap: 0.75 }}
            onClick={async () => {
              const result = await run("refresh")
              if (
                checkCertificate &&
                result?.can_sign &&
                !isFinished(result) &&
                !isReconciling(result)
              ) {
                await certificate.mutate().catch(() => {})
              }
            }}
          >
            <RefreshRounded fontSize="small" />
            بررسی مجدد وضعیت
          </Button>
          {showSigningForm && (
            <Button
              color="error"
              disabled={!canSign}
              onClick={() => setConfirmDecline(true)}
            >
              رد امضای قرارداد
            </Button>
          )}
        </Stack>
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
