import { useMemo } from "react"
import useSWR from "swr"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export type DealRole = "customer" | "beneficiary" | "broker"

export interface Deal {
  id: number
  label: string
  traceNumber: string
  title: string
  status: string
  state: string
  subState: number | null
  amount: number
  created_at: string
  parties: Array<{ role: string; user: string }>
}

interface DealItem {
  deal: number
  description: string
  escrow_price: number | string | null
  id: number
  images_count: number
  name: string
  price: number
  properties: Record<string, unknown>
  quantity: number
  remaining_price_payment_description: string | null
  remaining_price_payment_method: string
  slug: string
  subcategory: string | null
}

interface DealResult {
  created_at: string
  id: number
  label: string
  items: DealItem[]
  parties: Array<{ role: string; user: string }>
  state: string
  sub_state: number | null
  total_amount: number | string | null
  trace_number: string
  updated_at?: string
}

interface PaginatedDealsResponse {
  count: number
  next: string | null
  previous: string | null
  results: DealResult[]
}

type DealsResponse = DealResult[] | PaginatedDealsResponse

interface UseDealsProps {
  search?: string
  role?: DealRole
  limit?: number
  offset?: number
}

const resolveDealTitle = (deal: DealResult) => {
  const firstItem = deal.items?.[0]
  return firstItem?.name || firstItem?.description || "معامله بدون عنوان"
}

const resolveDealAmount = (deal: DealResult) => {
  if (deal.total_amount !== null && deal.total_amount !== undefined) {
    const totalAmount = Number(deal.total_amount)
    return Number.isFinite(totalAmount) ? totalAmount : 0
  }

  return (
    deal.items?.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || 1),
      0,
    ) || 0
  )
}

export function useDeals({
  search = "",
  role,
  limit = 10,
  offset = 0,
}: UseDealsProps = {}) {
  const normalizedSearch = search.trim()
  const { data, error, isLoading } = useSWR<DealsResponse>(
    [API_URLS.deals, normalizedSearch, role || "", limit, offset],
    ([url, searchValue, roleValue, pageLimit, pageOffset]: [
      string,
      string,
      string,
      number,
      number,
    ]) =>
      request.get({
        url,
        params: {
          ...(searchValue ? { search: searchValue } : {}),
          ...(roleValue ? { role: roleValue } : {}),
          limit: pageLimit,
          offset: pageOffset,
        },
      }),
  )

  const dealResults = useMemo(
    () => (Array.isArray(data) ? data : data?.results || []),
    [data],
  )

  const deals = useMemo(
    () =>
      dealResults.map((deal) => ({
        id: deal.id,
        label: deal.label,
        traceNumber: deal.trace_number,
        title: resolveDealTitle(deal),
        status: deal.state?.toString() || "نامشخص",
        state: deal.state?.toString() || "",
        subState: deal.sub_state,
        amount: resolveDealAmount(deal),
        created_at:
          deal.created_at || deal.updated_at || new Date().toISOString(),
        parties: deal.parties || [],
      })),
    [dealResults],
  )

  return {
    deals,
    totalCount: Array.isArray(data) ? data.length : data?.count || deals.length,
    isLoading,
    error,
  }
}
