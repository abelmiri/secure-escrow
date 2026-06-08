import { useEffect, useState } from "react"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

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
  properties: Record<string, any>
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

export function useDeals({ limit = 10, offset = 0 }: UseDealsProps = {}) {
  const [deals, setDeals] = useState<Deal[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    setIsLoading(true)
    request
      .get({
        url: API_URLS.deals,
        params: {
          limit,
          offset,
        },
      })
      .then((data: DealsResponse) => {
        const mappedDeals = data.results.map((deal) => ({
          id: deal.id,
          title: resolveDealTitle(deal),
          status: deal.state?.toString() || "نامشخص",
          amount: resolveDealAmount(deal),
          created_at:
            deal.created_at || deal.updated_at || new Date().toISOString(),
        }))

        setDeals(mappedDeals)
        setTotalCount(data.count || mappedDeals.length)
        setError(null)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [limit, offset])

  return {
    deals,
    totalCount,
    isLoading,
    error,
  }
}
