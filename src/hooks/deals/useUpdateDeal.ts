import { useCallback, useState } from "react"
import { mutate } from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export interface UpdateDealPayload {
  items?: Array<Record<string, unknown>>
  parties?: Array<{
    user: string
    role: string
  }>
}

interface UpdateDealOptions {
  successMessage?: string
  failMessage?: string
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
        const response = await request.patch({
          url: API_URLS.deal({ id: dealId }),
          data,
          successMessage: options.successMessage,
          failMessage: options.failMessage,
        })

        await mutate(API_URLS.deal({ id: dealId }))
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
