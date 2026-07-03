import createQueryString from "@/helpers/query-param/createQueryString"

export type LandingRole = "seller" | "buyer" | "broker"
export type TransactionRole = "customer" | "beneficiary" | "broker"

export interface TransactionPrefillData {
  role?: TransactionRole
  categoryId?: string
  amount?: string
}

export const TRANSACTION_PREFILL_STORAGE_KEY = "transactionPrefill"

export const LANDING_TO_TRANSACTION_ROLE: Record<LandingRole, TransactionRole> =
  {
    seller: "beneficiary",
    buyer: "customer",
    broker: "broker",
  }

export function tomanToRial(toman: string): string {
  const digits = toman.replace(/[^\d]/g, "")
  if (!digits) return ""
  return (Number(digits) * 10).toString()
}

export function buildTransactionCreateUrl(
  data: TransactionPrefillData,
): string {
  const params: Record<string, string> = {}

  if (data.role) params.role = data.role
  if (data.categoryId) params.categoryId = data.categoryId
  if (data.amount) params.amount = data.amount

  return `/contracts/create${createQueryString({ params })}`
}

export function parseTransactionPrefillFromSearchParams(
  searchParams: URLSearchParams,
): TransactionPrefillData {
  const role = searchParams.get("role")
  const categoryId = searchParams.get("categoryId")
  const amount = searchParams.get("amount")

  const validRoles: TransactionRole[] = ["customer", "beneficiary", "broker"]

  return {
    role:
      role && validRoles.includes(role as TransactionRole)
        ? (role as TransactionRole)
        : undefined,
    categoryId: categoryId || undefined,
    amount: amount?.replace(/[^\d]/g, "") || undefined,
  }
}

export function saveTransactionPrefill(data: TransactionPrefillData): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(TRANSACTION_PREFILL_STORAGE_KEY, JSON.stringify(data))
}

export function loadTransactionPrefill(): TransactionPrefillData | null {
  if (typeof window === "undefined") return null

  const raw = sessionStorage.getItem(TRANSACTION_PREFILL_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as TransactionPrefillData
  } catch {
    return null
  }
}

export function clearTransactionPrefill(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(TRANSACTION_PREFILL_STORAGE_KEY)
}

export function createPrefillFromLandingForm({
  role,
  categoryId,
  amount,
}: {
  role: LandingRole
  categoryId: string
  amount: string
}): TransactionPrefillData {
  return {
    role: LANDING_TO_TRANSACTION_ROLE[role],
    categoryId: categoryId || undefined,
    amount: amount || undefined,
  }
}
