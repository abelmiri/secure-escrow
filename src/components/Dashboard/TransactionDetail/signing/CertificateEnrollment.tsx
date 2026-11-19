"use client"

import { useRef, useState } from "react"
import { Alert, Button, MenuItem, Stack, TextField } from "@mui/material"
import useSWR from "swr"
import {
  certificateRequest,
  normalizeSignatureDigits,
  SignatureError,
  signatureErrorMessage,
  type EnrollmentInput,
  type EnrollmentResult,
  type RokhLocation,
} from "@/hooks/deals/contractSignatureApi"

const emptyNames = {
  given_name: "",
  surname: "",
  given_name_lat: "",
  surname_lat: "",
}
const nameLabels = {
  given_name: "نام فارسی",
  surname: "نام خانوادگی فارسی",
  given_name_lat: "نام لاتین",
  surname_lat: "نام خانوادگی لاتین",
}

const enrollmentJobs = new Map<string, string>()

export default function CertificateEnrollment({
  dealId,
  identity,
  signingState,
  refreshStatus,
}: {
  dealId: number
  identity: string
  signingState: string
  refreshStatus: () => Promise<unknown>
}) {
  const scope = `${identity}:${dealId}`
  const [names, setNames] = useState(emptyNames)
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [certType, setCertType] =
    useState<EnrollmentInput["cert_type"]>("UNAFFILIATED")
  const [pin, setPin] = useState("")
  const [otp, setOtp] = useState("")
  const [otpUntil, setOtpUntil] = useState(0)
  const [job, setJob] = useState(() => enrollmentJobs.get(scope))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const lock = useRef(false)
  const inProgress = signingState === "ENROLLMENT_PENDING" || !!job
  const provinces = useSWR(
    inProgress ? null : ["rokh-provinces", scope],
    () =>
      certificateRequest<{ provinces: RokhLocation[] }>(
        dealId,
        "provinces",
        AbortSignal.timeout(30000),
      ),
    { shouldRetryOnError: false },
  )
  const cities = useSWR(
    !province || inProgress
      ? null
      : (["rokh-cities", scope, province] as const),
    ([, , provinceId]) =>
      certificateRequest<{ cities: RokhLocation[] }>(
        dealId,
        `provinces/${provinceId}/cities`,
        AbortSignal.timeout(45000),
      ),
    { shouldRetryOnError: false },
  )
  const jobStatus = useSWR(
    job ? (["rokh-enrollment-job", scope, job] as const) : null,
    async ([, , token]) => {
      try {
        return await certificateRequest<EnrollmentResult>(
          dealId,
          `job?token=${encodeURIComponent(token)}`,
          AbortSignal.timeout(30000),
        )
      } catch (caught) {
        if (
          caught instanceof SignatureError &&
          [400, 404].includes(caught.status)
        ) {
          return { status: "FAILED" as const }
        }
        throw caught
      }
    },
    {
      refreshInterval: 5000,
      shouldRetryOnError: false,
      onSuccess: (result) => {
        if (result.status === "PENDING") return
        enrollmentJobs.delete(scope)
        setJob(undefined)
        if (result.status === "FAILED")
          setError("صدور گواهی ناموفق بود؛ کد پیامکی تازه بگیرید.")
        void refreshStatus().catch(() => {})
      },
    },
  )

  const provinceId = provinces.data?.provinces.find(
    (item) => String(item.id) === province,
  )?.id
  const cityId = cities.data?.cities.find(
    (item) => String(item.id) === city,
  )?.id
  const valid =
    provinceId !== undefined &&
    cityId !== undefined &&
    Object.values(names).every((value) => value.trim()) &&
    /^\d{6}$/.test(pin)
  const run = async (operation: "otp" | "enroll") => {
    if (
      lock.current ||
      inProgress ||
      !valid ||
      provinceId === undefined ||
      cityId === undefined
    )
      return
    if (operation === "otp" && Date.now() < otpUntil) {
      setError("کد قبلی هنوز معتبر است؛ تا پایان دو دقیقه صبر کنید.")
      return
    }
    if (
      operation === "enroll" &&
      (Date.now() >= otpUntil || !/^\d{6}$/.test(otp))
    ) {
      setError("کد پیامکی معتبر شش‌رقمی وارد کنید.")
      return
    }
    lock.current = true
    setBusy(true)
    setError("")
    const data =
      operation === "enroll"
        ? {
            ...names,
            province_id: provinceId,
            city_id: cityId,
            cert_type: certType,
            pin,
            otp,
          }
        : undefined
    if (data) {
      setPin("")
      setOtp("")
      setOtpUntil(0)
    } else {
      setOtp("")
    }
    try {
      const result = await certificateRequest<EnrollmentResult>(
        dealId,
        operation,
        AbortSignal.timeout(90000),
        { key: crypto.randomUUID(), data },
      )
      if (operation === "otp") {
        setOtpUntil(Date.now() + 120000)
      } else if (result.job_token) {
        enrollmentJobs.set(scope, result.job_token)
        setJob(result.job_token)
      }
    } catch (caught) {
      setError(signatureErrorMessage(caught))
    } finally {
      if (operation === "enroll") await refreshStatus().catch(() => {})
      lock.current = false
      setBusy(false)
    }
  }

  if (inProgress) {
    return (
      <Alert
        severity={jobStatus.error ? "warning" : "info"}
        action={
          <Button
            onClick={() =>
              void (job ? jobStatus.mutate() : refreshStatus()).catch(() => {})
            }
          >
            بررسی مجدد
          </Button>
        }
      >
        {jobStatus.error
          ? "وضعیت صدور دریافت نشد؛ دوباره بررسی کنید و درخواست تازه نفرستید."
          : "در حال پیگیری صدور گواهی رخ؛ دوباره درخواست ارسال نکنید."}
      </Alert>
    )
  }
  return (
    <Stack spacing={2}>
      <Alert severity="info">
        برای ادامهٔ امضا، گواهی رخ را فعال یا رمز امضا را تنظیم کنید.
      </Alert>
      {error && <Alert severity="error">{error}</Alert>}
      {(provinces.error || cities.error) && (
        <Alert
          severity="error"
          action={
            <Button
              onClick={() =>
                void (provinces.error ? provinces.mutate() : cities.mutate())
              }
            >
              تلاش مجدد
            </Button>
          }
        >
          فهرست استان یا شهر رخ دریافت نشد.
        </Alert>
      )}
      {(Object.keys(names) as (keyof typeof names)[]).map((field) => (
        <TextField
          key={field}
          label={nameLabels[field]}
          value={names[field]}
          disabled={busy}
          onChange={(event) =>
            setNames({ ...names, [field]: event.target.value })
          }
        />
      ))}
      <TextField
        select
        label="استان (رخ)"
        value={province}
        disabled={busy || !provinces.data}
        onChange={(event) => {
          setProvince(event.target.value)
          setCity("")
        }}
      >
        <MenuItem value="">انتخاب استان</MenuItem>
        {provinces.data?.provinces.map((item) => (
          <MenuItem key={item.id} value={String(item.id)}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="شهر (رخ)"
        value={city}
        disabled={busy || !cities.data}
        onChange={(event) => setCity(event.target.value)}
      >
        <MenuItem value="">انتخاب شهر</MenuItem>
        {cities.data?.cities.map((item) => (
          <MenuItem key={item.id} value={String(item.id)}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="نوع گواهی"
        value={certType}
        disabled={busy}
        onChange={(event) =>
          setCertType(
            event.target.value === "UNAFFILIATED_M"
              ? "UNAFFILIATED_M"
              : "UNAFFILIATED",
          )
        }
      >
        <MenuItem value="UNAFFILIATED">شخص حقیقی</MenuItem>
        <MenuItem value="UNAFFILIATED_M">شخص حقیقی (UNAFFILIATED_M)</MenuItem>
      </TextField>
      <TextField
        label="رمز شش‌رقمی امضا"
        type="password"
        value={pin}
        disabled={busy}
        autoComplete="new-password"
        slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 6 } }}
        onChange={(event) =>
          setPin(normalizeSignatureDigits(event.target.value))
        }
      />
      <Button disabled={busy || !valid} onClick={() => void run("otp")}>
        دریافت کد صدور گواهی
      </Button>
      {otpUntil > 0 && (
        <Alert severity="info">اعتبار کد پیامکی دو دقیقه است.</Alert>
      )}
      <TextField
        label="کد پیامکی صدور گواهی"
        value={otp}
        disabled={busy || !otpUntil}
        autoComplete="one-time-code"
        slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 6 } }}
        onChange={(event) =>
          setOtp(normalizeSignatureDigits(event.target.value))
        }
      />
      <Button
        variant="contained"
        disabled={busy || !valid || !/^\d{6}$/.test(otp) || !otpUntil}
        onClick={() => void run("enroll")}
      >
        ثبت درخواست صدور گواهی
      </Button>
    </Stack>
  )
}
