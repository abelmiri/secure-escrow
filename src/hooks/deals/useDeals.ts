import { useEffect, useState } from "react"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export interface Deal {
  id: number
  title: string
  status: string
  amount: number
  created_at: string
  // Add other relevant fields based on your API response structure
}

interface DealsResponse {
  collection: Deal[]
  metadata: {
    total_count: number
    limit: number
    offset: number
  }
}

interface UseDealsProps {
  limit?: number
  offset?: number
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
        setDeals(data.collection)
        setTotalCount(data.metadata?.total_count || 0)
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
