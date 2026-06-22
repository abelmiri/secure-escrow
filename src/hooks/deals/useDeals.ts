import { useMemo } from "react"
import useSWR from "swr"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export type DealRole = "customer" | "beneficiary" | "broker"

export interface Deal {
  id: number
  title: string
  status: string
  amount: number
  created_at: string
}

interface DealItem {
  deal: number
  description: string
  id: number
  images_count: number
  name: string
  price: number
  properties: Record<string, unknown>
  quantity: number
  slug: string
}

interface DealResult {
  id: number
  items: DealItem[]
  items_count: number | null
  parties: Array<{ role: string; user: string }>
  state: number
  sub_state: number
  trace_number: string
  created_at?: string
  updated_at?: string
}

interface DealsResponse {
  count: number
  next: string | null
  previous: string | null
  results: DealResult[]
}

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
  return deal.items?.reduce((sum, item) => sum + Number(item.price || 0), 0) || 0
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

  const deals = useMemo(
    () =>
      (data?.results || []).map((deal) => ({
          id: deal.id,
          title: resolveDealTitle(deal),
          status: deal.state?.toString() || "نامشخص",
          amount: resolveDealAmount(deal),
          created_at:
            deal.created_at || deal.updated_at || new Date().toISOString(),
        })),
    [data],
  )

  return {
    deals,
    totalCount: data?.count || deals.length,
    isLoading,
    error,
  }
}
