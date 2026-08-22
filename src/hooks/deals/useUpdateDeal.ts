import { useCallback, useState } from "react"
import { mutate } from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export interface UpdateDealPayload {
  item?: Record<string, unknown>
  parties?: Array<{
    role: string
    user?: string
    partner?: string | number
    is_representative?: boolean
  }>
}

interface UpdateDealOptions {
  successMessage?: string
  failMessage?: string
  brokerId?: string | number | null
}

export function useUpdateDeal() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const updateDeal = useCallback(
    async (
      dealId: number,
      data: UpdateDealPayload,
      options: UpdateDealOptions = {},
    ) => {
      setIsUpdating(true)
      setError(null)

      try {
        const dealUrl = options.brokerId
          ? API_URLS.brokerDeal({ brokerId: options.brokerId, id: dealId })
          : API_URLS.deal({ id: dealId })
        const response = await request.patch({
          url: dealUrl,
          data,
          successMessage: options.successMessage,
          failMessage: options.failMessage,
        })

        await mutate(dealUrl)
        return response
      } catch (updateError) {
        setError(updateError)
        throw updateError
      } finally {
        setIsUpdating(false)
      }
    },
    [],
  )

  return {
    updateDeal,
    isUpdating,
    error,
  }
}
