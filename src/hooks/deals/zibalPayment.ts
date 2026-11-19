export interface DealPayment {
  order_id: string
  track_id: string | null
  amount: number
  currency: "IRR"
  status: "pending" | "failed" | "verified" | "needs_review"
  message: string
  error_code: string | null
  gateway_code: number | null
  gateway_endpoint: string
  provider_status: number | null
  next_action:
    "redirect" | "retry_payment" | "wait" | "contact_support" | "complete"
  retryable: boolean
  payment_url: string | null
}

export function getZibalPaymentUrl(payment: DealPayment): string | null {
  if (
    payment.status !== "pending" ||
    payment.next_action !== "redirect" ||
    !payment.payment_url
  )
    return null
  try {
    const url = new URL(payment.payment_url)
    if (
      url.origin !== "https://gateway.zibal.ir" ||
      !/^\/start\/[0-9]+$/.test(url.pathname) ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    )
      return null
    return url.href
  } catch {
    return null
  }
}

export function rememberPayment(orderId: string, dealId: number) {
  try {
    sessionStorage.setItem(`zibal-deal:${orderId}`, String(dealId))
  } catch {
    // Storage is optional; payment navigation must still work.
  }
}

export function getPaymentDealId(orderId: string): number | null {
  try {
    const value = Number(sessionStorage.getItem(`zibal-deal:${orderId}`))
    return Number.isSafeInteger(value) && value > 0 ? value : null
  } catch {
    return null
  }
}
