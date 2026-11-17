import API_URLS from "@/constants/urls/API_URLS"
import headerMaker from "@/request/headerMaker"
import urlMaker from "@/request/urlMaker"
import handleUnauthorized from "@/helpers/auth/handleUnauthorized"

export type SignatureStatus =
  "PENDING" | "PROCESSING" | "COMPLETED" | "REFUSED" | "EXPIRED"
export type SignerStatus =
  | "PENDING"
  | "PROCESSING"
  | "SIGNED"
  | "FAILED"
  | "UNKNOWN"
  | "REFUSED"
  | "EXPIRED"
export interface SignatureSnapshot {
  status: SignatureStatus
  expires_at: string | null
  completed_at: string | null
  contract_document: string | null
  signed_document: string | null
  can_sign: boolean
  signers: {
    role: "customer" | "beneficiary"
    status: SignerStatus
    signed_at: string | null
    is_you: boolean
  }[]
  otp?: { sent: boolean; expires_in_seconds: number }
  signed_signer?: "customer" | "beneficiary"
}
export class SignatureError extends Error {
  constructor(
    public status: number,
    public data: Record<string, unknown>,
  ) {
    super("Signature request failed")
  }
}

// Keep this transport separate: the general request layer logs errors and logs out on 403.
export async function signatureFetch(
  url: string,
  signal: AbortSignal,
  body?: FormData,
  method = "GET",
) {
  const response = await fetch(urlMaker({ url }), {
    method,
    body,
    headers: headerMaker(),
    signal,
    cache: "no-store",
  })
  if (response.status === 401) handleUnauthorized()
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new SignatureError(
      response.status,
      data && typeof data === "object" ? data : {},
    )
  }
  return response
}

export async function signatureRequest(
  id: number,
  signal: AbortSignal,
  operation?: "otp" | "sign" | "refresh" | "decline",
  body?: FormData,
): Promise<SignatureSnapshot> {
  const response = await signatureFetch(
    API_URLS.contractSignature({ id, operation }),
    signal,
    body,
    operation ? "POST" : "GET",
  )
  return response.json()
}
export const isReconciling = (snapshot: SignatureSnapshot) =>
  snapshot.status === "PROCESSING" ||
  snapshot.signers.some(
    (s) => s.status === "PROCESSING" || s.status === "UNKNOWN",
  )
export const isFinished = (snapshot: SignatureSnapshot) =>
  ["COMPLETED", "REFUSED", "EXPIRED"].includes(snapshot.status)
export const normalizeSignatureDigits = (value: string) =>
  value.replace(/[۰-۹٠-٩]/g, (digit) =>
    String(
      "۰۱۲۳۴۵۶۷۸۹".indexOf(digit) >= 0
        ? "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)
        : "٠١٢٣٤٥٦٧٨٩".indexOf(digit),
    ),
  )
export async function validateSignature(file: File) {
  if (file.type !== "image/png" || file.size === 0 || file.size > 1024 * 1024)
    return "تصویر امضا باید PNG و حداکثر ۱ مگابایت باشد."
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  if (
    ![137, 80, 78, 71, 13, 10, 26, 10].every(
      (byte, index) => bytes[index] === byte,
    )
  )
    return "فایل انتخاب‌شده PNG معتبر نیست."
  return ""
}

const messages: Record<string, string> = {
  INVALID_PIN: "رمز شش‌رقمی امضا صحیح نیست.",
  OTP_EXPIRED: "کد پیامکی منقضی شده؛ کد تازه دریافت کنید.",
  OTP_USED: "کد پیامکی قبلاً استفاده شده؛ کد تازه دریافت کنید.",
  INSUFFICIENT_BALANCE: "موجودی لازم برای امضا فراهم نیست.",
  SIGNATURE_CONFIGURATION:
    "تنظیمات سرویس امضا کامل نیست؛ با پشتیبانی تماس بگیرید.",
  UNAVAILABLE_OR_INVALID_RESPONSE:
    "پاسخ سرویس امضا قابل تأیید نیست؛ وضعیت را پیگیری کنید.",
}
export function signatureErrorMessage(error: unknown) {
  if (!(error instanceof SignatureError))
    return "ارتباط برقرار نشد. وضعیت را دوباره بررسی کنید."
  if (error.status === 403) return "اجازهٔ امضای این معامله را ندارید."
  if (error.status === 404) return "معامله یا درخواست امضا یافت نشد."
  const parts = [
    error.data.detail,
    error.data.message,
    error.data.error,
  ].filter((v): v is string => typeof v === "string")
  return (
    parts.join("؛ ") ||
    messages[String(error.data.code)] ||
    "انجام عملیات ممکن نشد. اطلاعات و وضعیت معامله را بررسی کنید."
  )
}
